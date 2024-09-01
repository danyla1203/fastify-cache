import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Resource } from './resource.entity.js';
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
  const em = fastify.orm.em;
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
    handler: async (
      req: FastifyRequest<{ Querystring: IQuerystring }>,
      reply: FastifyReply,
    ) => {
      const record = await em.findOne(Resource, req.query.id);
      return record || reply.code(404).send('Not found');
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
      const resource = new Resource(body);
      await em.persist(resource).flush();
      return resource;
    },
  });

  fastify.route({
    url: '/all',
    method: 'GET',
    handler: async () => {
      return em.findAll(Resource);
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
    handler: async (
      { query }: FastifyRequest<{ Querystring: IQuerystring }>,
      reply: FastifyReply,
    ) => {
      const toDelete = await em.findOne(Resource, query.id);
      return !toDelete
        ? reply.code(404).send('Resource not found')
        : em.removeAndFlush(toDelete);
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
    handler: async (
      {
        body,
        query,
      }: FastifyRequest<{
        Body: Partial<InsertResourceDto>;
        Querystring: IQuerystring;
      }>,
      reply: FastifyReply,
    ) => {
      const toUpdate = await em.findOne(Resource, query.id);
      if (!toUpdate) {
        reply.code(404).send('Resource not found');
        return null;
      }
      toUpdate.name = body.name || toUpdate.name;
      toUpdate.price = body.price || toUpdate.price;
      toUpdate.description = body.description || toUpdate.description;
      toUpdate.text = body.text || toUpdate.text;
      await em.flush();
      return toUpdate;
    },
  });
};
