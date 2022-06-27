import express, { Express, Request, Response } from 'express';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka:9092']
});

const topic = 'test-topic';
const admin = kafka.admin();
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

const port = process.env.PORT || 3000;
const app: Express = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('OK');
});

app.post('/message', async (req: Request, res: Response) => {
    // Producing
    const { message } = req.body || {};
    if (!message) {
        res.status(400).send('Missing message');
        return;
    }
    await producer.send({
        topic,
        messages: [
            { value: message }
        ]
    });
    res.send(`Message successfully sent to topic ${topic}`);
});

const run = async () => {
    await admin.connect();
    await admin.createTopics({
        topics: [
            {
                topic,
                numPartitions: 1,
                replicationFactor: 1
            }
        ],
    });
    await admin.disconnect();

    await producer.connect();
    await consumer.connect();

    // Consuming
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString()
            });
        }
    });

    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
};

run().catch(console.error);
