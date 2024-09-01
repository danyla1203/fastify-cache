import fastify, { FastifyInstance } from 'fastify';
import redis from '@fastify/redis';
import mikroOrmPlugin from './plugin/mikroorm.js';
import { MikroORM } from '@mikro-orm/core';
import { resourceController } from './resource/index.js';

declare module 'fastify' {
  interface FastifyInstance {
    orm: MikroORM;
  }
}

const server: FastifyInstance = fastify({ logger: true });

server.register(mikroOrmPlugin);
server.register(redis);
server.register(resourceController, { prefix: '/api/v1/resource' });

const start = async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
