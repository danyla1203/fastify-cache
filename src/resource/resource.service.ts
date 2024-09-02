import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { resourceDao } from './resource.dao.js';

export const resourceService = async (fastify: FastifyInstance) => {
  await fastify.register(fp(resourceDao));

  const getItem = async (id: number) => {
    const item = await fastify.dao.getItemById(id);
    //TODO: Client errors
    if (!item) throw new Error('Not found');
    return item;
  };

  fastify.decorate('service', { getItem });
};
