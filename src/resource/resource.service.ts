import { FastifyInstance } from 'fastify';
import resourceDao from './resource.dao.js';
import { InsertResourceDto } from './resource.controller.js';
import { Resource } from './resource.entity.js';
import { ResourceNotFound } from './errors.js';

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
    if (!item) throw new ResourceNotFound();
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
    if (!updatedOne) throw new ResourceNotFound();
    return updatedOne;
  };
  const deleteItem = async (id: number) => {
    const item = await scope.dao.deleteItem(id);
    if (!item) throw new ResourceNotFound();
    return item;
  };

  scope.decorate('service', {
    getItem,
    addItem,
    getAll,
    updateItem,
    deleteItem,
  });
};
