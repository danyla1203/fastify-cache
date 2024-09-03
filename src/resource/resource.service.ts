import { FastifyInstance } from 'fastify';
import resourceDao from './resource.dao.js';
import { InsertResourceDto } from './resource.controller.js';
import { Resource } from './resource.entity.js';

declare module 'fastify' {
  interface FastifyInstance {
    dao: ResourceDaoI;
  }
}

interface ResourceDaoI {
  getItemById: (id: number) => Promise<Resource>;
  getAllResources: () => Promise<Resource[]>;
  insertItem: (input: InsertResourceDto) => Promise<Resource>;
  deleteItem: (id: number) => Promise<Resource>;
  updateItem: (
    id: number,
    input: Partial<InsertResourceDto>,
  ) => Promise<Resource>;
}

export const resourceService = async (scope: FastifyInstance) => {
  await scope.register(resourceDao);

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
