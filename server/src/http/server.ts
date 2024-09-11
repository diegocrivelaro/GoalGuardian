import fastify from 'fastify';

const app = fastify();

const port = 3232;

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`O servidor foi iniciado na porta ${port}! 🚀🔥`);
  });
