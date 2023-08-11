require('dotenv').config();
const fastify = require('fastify');
const bcrypt = require('bcryptjs');
const {
  users, sessions, games, keys, sequelize,
} = require('./models');

const SteamAPI = require('./stores/steam/steam');
const GogAPI = require('./stores/gog/gog');
const EpicAPI = require('./stores/epic/epic');

const rankResults = require('./stores/utils/rankResults');

const { createSession } = require('./utils');
const authHook = require('./hooks/auth');

const app = fastify({ loqger: true });

app.register(require('@fastify/cookie'), {
  secret: process.env.COOKIE_SECRET,
  hook: 'preValidation',
});

async function start() {
  await app.listen({ port: 5000 });
}

start();

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/api/games/offers/:term', async (req, res) => {
  const { term } = req.params;
  const storesAPIs = [SteamAPI, GogAPI, EpicAPI];
  const searchRequests = storesAPIs.map((API) => API.searchGame(term));
  const responses = await Promise.all(searchRequests);
  const flat = responses.reduce((acc, cur) => [...acc, ...cur], []);
  res.send(rankResults(flat, term));
});

app.post('/api/games', {
  preHandler: authHook,
  handler: async (req, res) => {
    const { key, url } = req.body;
    const steamId = url.match('\\/app\\/(\\d+)\\/')[1];
    const transaction = await sequelize.transaction();

    try {
      const existingGame = await games.findOne({ where: { steamId } });
      if (existingGame) {
        await keys.create({
          game_id: existingGame.id,
          creator_id: req.user.id,
          key,
        }, { transaction });
        return existingGame.increment('keyCount', { by: 1, transaction });
      }
      const result = await SteamAPI.scrapeGame(url);

      const game = await games.create({
        steamId,
        ...result,
        keyCount: 1,
      }, { transaction });

      await keys.create({
        game_id: game.id,
        creator_id: req.user.id,
        key,
      }, { transaction });

      res.send(game?.dataValues);
      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
    }
  },
});

app.get('/api/games', async (req, res) => {
  const result = await games.findAll({ order: [['createdAt', 'ASC']], limit: 50 });
  res.send(result);
});

app.post('/api/games/:id/claim', {
  preHandler: authHook,
  handler: async (req, res) => {
    const { id } = req.params;
    const game = await games.findByPk(id, { include: [{ model: keys, where: { owner_id: null } }] });
    if (!game) return res.code(404).send('Вільних ключів немає');
    const transaction = await sequelize.transaction();
    try {
      const [key] = game.keys;
      await key.update({ owner_id: req.user.id }, { transaction });
      await game.decrement('keyCount', { by: 1, transaction });
      res.send(key.dataValues);
      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
    }
  }
});

app.get('/api/games/my-keys', {
  preHandler: authHook,
  handler: async (req, res) => {
    const myKeys = await keys.findAll({
      where: { owner_id: req.user.id },
      include: { model: games },
    });

    res.send(myKeys);
  },
});

app.post('/api/users', async (req, res) => {
  const sendWrongCredentialsRes = () => res
    .code(400)
    .send('Невірні дані входу. Будь ласка, перевірте.');
  const { username, password } = req.body;

  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hash(password, salt);

  const [user, created] = await users.findOrCreate(
    {
      where: { username },

      defaults: { username, password: hash },
    },
  );
  if (!created) {
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) return sendWrongCredentialsRes();
  }
  await createSession(res, user.id);

  delete user.dataValues.password;
  return res.code(201).send(user);
});

app.delete('/api/users/logout', {
  preHandler: authHook,
  handler: async (req, res) => {
    await sessions.destroy({ where: { sid: req.sid } });
    res.clearCookie('sid');
    res.code(200).send();
  },
});

app.get('/api/users/current', {
  preHandler: authHook,
  handler: (req, res) => res.send({ loggedIn: !!req.user, ...req?.user?.dataValues }),
});
