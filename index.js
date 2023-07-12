import fastify from 'fastify';

const app = fastify({ loqger: true });

app.get('/', (req, res) => {
  res.send('Hello world');
});

await app.listen({ port: 5000 });
