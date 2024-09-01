import fastify, { FastifyInstance } from 'fastify';

const server: FastifyInstance = fastify({ logger: true });

const start = async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
