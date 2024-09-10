import { FastifyInstance, FastifyRequest } from 'fastify';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

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

      const result = await fastify.rpc.getById({ id: query.id });
      await fastify.cache.set(cacheKey, result, 10000);

      return result;
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
      const newResource = await fastify.rpc.insertResource(body);
      await fastify.cache.set(
        `resource:${newResource.id.toString()}`,
        newResource,
        10000,
      );
      return newResource;
    },
  });

  fastify.route({
    url: '/all',
    method: 'GET',
    handler: async () => {
      const resources = await fastify.rpc.getAllResource();

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
      return fastify.rpc.deleteResource({ id: query.id });
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
      return fastify.rpc.updateResource({ ...body, id: query.id });
    },
  });
};
