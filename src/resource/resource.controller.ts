import { FastifyInstance, FastifyRequest } from 'fastify';
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
    handler: async (req: FastifyRequest<{ Querystring: IQuerystring }>) => {
      return em.findOne(Resource, req.query.id);
    },
  });

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        required: ['name'],
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
};
