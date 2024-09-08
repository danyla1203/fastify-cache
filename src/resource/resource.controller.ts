import { FastifyInstance, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { resourceService } from './resource.service.js';
import { Resource } from './resource.entity.js';

declare module 'fastify' {
  interface FastifyInstance {
    service: ResourceServiceI;
  }
}

interface ResourceServiceI {
  getItem: (id: number) => Promise<Resource>;
  getAll: () => Promise<Resource[]>;
  addItem: (input: InsertResourceDto) => Promise<Resource>;
  deleteItem: (id: number) => Promise<Resource>;
  updateItem: (
    id: number,
    input: Partial<InsertResourceDto>,
  ) => Promise<Resource>;
}

interface IQuerystring {
  id: number;
}
export interface InsertResourceDto {
  name: string;
  description: string;
  price: number;
  text: string;
}

export const resourceController: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify: FastifyInstance,
) => {
  await fastify.register(fastifyPlugin(resourceService));

  fastify.route({
    url: '/',
    method: 'GET',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
        required: ['id'],
      },
    },
    handler: async ({
      query,
    }: FastifyRequest<{ Querystring: IQuerystring }>) => {
      const cacheKey = `resource:${query.id}`;
      const cache = await fastify.cache.get(cacheKey);
      if (cache) return cache.item;
    
      const item = await fastify.service.getItem(query.id);
      await fastify.cache.set(cacheKey, item, 10000);
      return item;
    },
  });

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        required: ['name', 'description', 'text', 'price'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          text: { type: 'string' },
          price: { type: 'number' },
        },
      },
    },
    handler: async ({ body }: FastifyRequest<{ Body: InsertResourceDto }>) => {
      const resource = await fastify.service.addItem(body);
      await fastify.cache.set(`resource:${resource.id.toString()}`, resource, 10000);
      return resource;
    },
  });

  fastify.route({
    url: '/all',
    method: 'GET',
    handler: async () => {
      const resources = await fastify.service.getAll();
      await fastify.cache.set(`resource:resources`, resources, 10000, () => {});
      return resources;
    },
  });

  fastify.route({
    url: '/',
    method: 'DELETE',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
        required: ['id'],
      },
    },
    handler: async ({
      query,
    }: FastifyRequest<{ Querystring: IQuerystring }>) => {
      return fastify.service.deleteItem(query.id);
    },
  });

  fastify.route({
    url: '/',
    method: 'PATCH',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          text: { type: 'string' },
          price: { type: 'number' },
        },
      },
    },
    handler: async ({
      body,
      query,
    }: FastifyRequest<{
      Body: Partial<InsertResourceDto>;
      Querystring: IQuerystring;
    }>) => {
      return fastify.service.updateItem(query.id, body);
    },
  });
};
