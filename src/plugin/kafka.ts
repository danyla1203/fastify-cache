import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Kafka } from 'kafkajs';

async function kafkaPlugin(fastify: FastifyInstance) {
  const kafka = new Kafka({
    clientId: 'demo-kafka',
    brokers: ['localhost:9092'],
  });

  const producer = kafka.producer();

  fastify.decorate('producer', producer);

  fastify.addHook('onListen', async () => {
    await producer.connect();
  })
  fastify.addHook('onClose', async () => {
    await producer.disconnect();
  })
}

export default fp(kafkaPlugin);
