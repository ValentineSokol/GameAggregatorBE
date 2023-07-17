const fastify = require('fastify');

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

async function start() {
  await app.listen({ port: 5000 });
}

start();
