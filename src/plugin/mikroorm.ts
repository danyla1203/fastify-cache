import fp from 'fastify-plugin';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../mikro-orm.config.js';
import { FastifyInstance } from 'fastify';

async function mikroOrmPlugin(fastify: FastifyInstance) {
  const orm = await MikroORM.init(mikroOrmConfig);
  fastify.decorate('orm', orm);

  fastify.addHook('onClose', async () => {
    await orm.close();
  });
}

export default fp(mikroOrmPlugin);
