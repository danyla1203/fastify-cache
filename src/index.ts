import fastify, { FastifyInstance } from 'fastify';
import { Redis } from 'ioredis';
import Abcache from 'abstract-cache';
import FastifyRedis from '@fastify/redis';
import FastifyCache from '@fastify/caching';
import mikroOrmPlugin from './plugin/mikroorm.js';
import { resourceController } from './resource/index.js';
import { MikroORM } from '@mikro-orm/core';

declare module 'fastify' {
  interface FastifyInstance {
    orm: MikroORM;
  }
}

const redis = new Redis();
const abcache = Abcache({
  useAwait: true,
  driver: {
    name: 'abstract-cache-redis',
    options: { client: redis },
  },
});

const server: FastifyInstance = fastify({ logger: true });

server
  .register(FastifyRedis, { client: redis })
  .register(FastifyCache, { cache: abcache, expiresIn: 10000 })
  .register(mikroOrmPlugin);

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
