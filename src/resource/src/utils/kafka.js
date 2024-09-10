import { Kafka } from 'kafkajs';

async function initKafka() {
  try {
    const kafka = new Kafka({
      clientId: 'demo-kafka',
      brokers: ['localhost:9092']
    });

    const consumer = kafka.consumer({ groupId: 'demo-group' });
    await consumer.connect();

    await consumer.subscribe({ topic: 'resource.getById' });

    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log({
          key: message.key,
          value: message.value,
          headers: message.headers,
        })
      },
    })
  } catch (e) {
    console.log(e);
  }
}
export { initKafka }