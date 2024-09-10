import knex from 'knex';

export const client = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'fastify-test',
  },
});
