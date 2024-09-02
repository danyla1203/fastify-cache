import { FastifyInstance } from 'fastify';
import { Resource } from './resource.entity.js';

export const resourceDao = async (fastify: FastifyInstance) => {
  const em = fastify.orm.em;
  const redis = fastify.redis;

  const getItemById = async (id: number) => {
    const cache = await redis.hgetall(id.toString());
    if (cache && Object.keys(cache).length > 0) return cache;
    const record = await em.findOne(Resource, id);
    if (!record) return null;
    await redis.hmset(record.id.toString(), record);
    return record;
  };

  fastify.decorate('dao', { getItemById });
};
