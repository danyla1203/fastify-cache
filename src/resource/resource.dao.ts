import { Resource } from './resource.entity.js';
import { InsertResourceDto } from './resource.controller.js';
import { FastifyInstance } from 'fastify';

export const resourceDao = async (scope: FastifyInstance) => {
  const em = scope.orm.em;
  const redis = scope.redis;

  const getItemById = async (id: number): Promise<Resource> => {
    const cache = await redis.hgetall(id.toString());
    if (cache && Object.keys(cache).length > 0) return cache;
    const record = await em.findOne(Resource, id);
    if (!record) return null;
    await redis.hmset(record.id.toString(), record);
    return record;
  };

  const insertItem = async (input: InsertResourceDto): Promise<Resource> => {
    const resource = new Resource(input);
    await em.persist(resource).flush();
    await scope.redis.hmset(resource.id.toString(), resource);
    return resource;
  };

  const getAllResources = () => {
    return em.findAll(Resource);
  };

  const updateItem = async (id: number, input: Partial<InsertResourceDto>) => {
    const toUpdate = await em.findOne(Resource, id);
    if (!toUpdate) return null;
    toUpdate.name = input.name || toUpdate.name;
    toUpdate.price = input.price || toUpdate.price;
    toUpdate.description = input.description || toUpdate.description;
    toUpdate.text = input.text || toUpdate.text;
    await em.flush();
    return toUpdate;
  };

  const deleteItem = async (id: number) => {
    const toDelete = await em.findOne(Resource, id);
    if (!toDelete) return null;
    await em.removeAndFlush(toDelete);
    return toDelete;
  };

  scope.decorate('dao', {
    getItemById,
    insertItem,
    getAllResources,
    updateItem,
    deleteItem,
  });
};
