import { Resource } from './resource.entity.js';
import { InsertResourceDto } from './resource.controller.js';
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

export async function resourceDao(scope: FastifyInstance) {
  const em = scope.orm.em;
  const cache = scope.cache;

  const getItemById = async (id: number): Promise<Resource> => {
    const cacheItem = await cache.get<Resource>(id.toString());
    if (cacheItem) return cacheItem.item;
    const record = await em.findOne(Resource, id);
    if (!record) return null;
    await cache.set(record.id.toString(), record, 60000);
    return record;
  };

  const insertItem = async (input: InsertResourceDto): Promise<Resource> => {
    const resource = new Resource(input);
    await em.persist(resource).flush();
    await cache.set(resource.id.toString(), resource, 60000);
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
    await cache.set(toDelete.id.toString(), null, 0);
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
}

export default fp(resourceDao);
