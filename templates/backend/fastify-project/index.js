import fastify from 'fastify';

const server = fastify({ logger: true });
const port = 3000;

server.get('/', async (request, response) => {
  return { hello: 'Hello, Fastify!' };
});

const start = async () => {
  try {
    await server.listen({ port: port, host: 'localhost' });
    server.log.info(`Server is running at ${server.server.address()}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
