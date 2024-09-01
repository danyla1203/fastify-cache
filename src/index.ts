import fastify, { FastifyInstance } from 'fastify';
import mikroOrmPlugin from './plugin/mikroorm.js';
import { MikroORM } from '@mikro-orm/core';

declare module 'fastify' {
  interface FastifyInstance {
    orm: MikroORM;
  }
}

const server: FastifyInstance = fastify({ logger: true });

server.register(mikroOrmPlugin);

const start = async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
