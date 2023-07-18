const fastify = require('fastify');
const bcrypt = require('bcryptjs');

const { users } = require('./models');

const SteamAPI = require('./stores/steam/steam');
const GogAPI = require('./stores/gog/gog');
const EpicAPI = require('./stores/epic/epic');

const rankResults = require('./stores/utils/rankResults');


const app = fastify({ loqger: true });

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

app.post('/api/users', async (req, res) => {
  const { username, password } = req.body;

  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hash(password, salt);

  const [user, created] = await users.findOrCreate({ where: { username }, defaults: { username, password: hash } });
  if (!created) return res.code(403);
  res.code(201).send(user);

});
async function start() {
  await app.listen({ port: 5000 });
}

start();
