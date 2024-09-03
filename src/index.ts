import fastify, { FastifyInstance } from 'fastify';
import redisOm from './plugin/redisOm.js';
import mikroOrmPlugin from './plugin/mikroorm.js';
import { MikroORM } from '@mikro-orm/core';
import { resourceController } from './resource/index.js';
import { CacheI } from './plugin/redisOm.js';

declare module 'fastify' {
  interface FastifyInstance {
    orm: MikroORM;
    cache: CacheI;
  }
}

const server: FastifyInstance = fastify({ logger: true });

server.register(mikroOrmPlugin);
server.register(redisOm);
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
