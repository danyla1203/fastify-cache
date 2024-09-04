import fp from 'fastify-plugin';
import { MikroORM, RequestContext } from '@mikro-orm/postgresql';
import mikroOrmConfig from '../mikro-orm.config.js';
import { FastifyInstance } from 'fastify';

async function mikroOrmPlugin(fastify: FastifyInstance) {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.schema.refreshDatabase();
  fastify.addHook('onRequest', (request, reply, done) => {
    RequestContext.create(orm.em, done);
  });

  fastify.decorate('orm', orm);

  fastify.addHook('onClose', async () => {
    await orm.close();
  });
}

export default fp(mikroOrmPlugin);
