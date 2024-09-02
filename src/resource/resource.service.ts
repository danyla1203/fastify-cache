import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { resourceDao } from './resource.dao.js';
import { InsertResourceDto } from './resource.controller.js';

export const resourceService = async (scope: FastifyInstance) => {
  await scope.register(fp(resourceDao));

  const getItem = async (id: number) => {
    const item = await scope.dao.getItemById(id);
    //TODO: Client errors
    if (!item) throw new Error('Not found');
    return item;
  };

  const addItem = async (input: InsertResourceDto) => {
    return scope.dao.insertItem(input);
  };

  const getAll = async () => {
    return scope.dao.getAllResources();
  };

  const updateItem = async (id: number, input: Partial<InsertResourceDto>) => {
    const updatedOne = await scope.dao.updateItem(id, input);
    if (!updatedOne) throw new Error('Not found');
    return updatedOne;
  };
  const deleteItem = async (id: number) => {
    return scope.dao.deleteItem(id);
  };

  scope.decorate('service', {
    getItem,
    addItem,
    getAll,
    updateItem,
    deleteItem,
  });
};
