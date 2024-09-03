import { FastifyInstance } from 'fastify';
import redis from '@fastify/redis';
import fp from 'fastify-plugin';

export interface CacheI {
  getItem: <T>(key: string) => Promise<T>;
  setItem: <T>(key: string, data: Partial<T>) => Promise<Partial<T>>;
  deleteItem: (key: string) => Promise<number>;
}

async function redisOm(scope: FastifyInstance) {
  await scope.register(redis);
  const client = scope.redis;

  const getItem = <T>(key: string): Promise<T> => {
    return client.hgetall(key) as Promise<T>;
  };

  const setItem = async <T>(
    key: string,
    data: Partial<T>,
  ): Promise<Partial<T>> => {
    await client.hmset(key, data);
    return data;
  };

  const deleteItem = (key: string) => {
    return client.del(key);
  };

  scope.decorate('cache', { getItem, setItem, deleteItem });
}

export default fp(redisOm);
