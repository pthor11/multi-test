import { EachMessagePayload, Kafka } from "kafkajs";
import { KAFKA_BROKERS, KAFKA_TOPIC, KAFKA_FILTER } from "./config";

const kafka = new Kafka({
    brokers: [KAFKA_BROKERS!],
    ssl: false,
    sasl: undefined,
    connectionTimeout: 5000,
    requestTimeout: 60000,
})

const kafkaConsumer = kafka.consumer({ groupId: `test-${Math.random().toString(36).substring(7)}`, allowAutoTopicCreation: true, })

const testKafka = async () => {
    try {
        const admin = kafka.admin()

        await admin.connect()

        console.log(`kafka admin connected`);

        const topicOffsets = await admin.fetchTopicOffsets(KAFKA_TOPIC!)

        console.log({ topicMetadata: JSON.stringify(topicOffsets) });

        const currentOffset = topicOffsets[0].offset

        console.log({ currentOffset });

        await kafkaConsumer.connect()

        console.log(`kafka consumer connected`)

        await kafkaConsumer.subscribe({
            topic: KAFKA_TOPIC!,
            fromBeginning: true
        })

        console.log(`topic ${KAFKA_TOPIC} subscribed`);

        const results: any[] = []

        await kafkaConsumer.run({
            eachMessage: async (payload: EachMessagePayload) => {
                try {
                    const { message } = payload

                    const { offset, value } = message

                    if (offset !== currentOffset) {
                        const value_string = value?.toString()

                        KAFKA_FILTER!.split(',').forEach(filter => {
                            if (value_string?.includes(filter)) {
                                console.log(`found ${filter} at offset ${offset} from message ${value_string}`)
                                results.push({ message, value_string })
                            }
                        })
                        console.log('offset', Number(offset), 'remain', Number(currentOffset) - Number(offset))
                    } else {
                        console.log(`DONE`)
                        console.log({
                            filters: KAFKA_FILTER,
                            results
                        });
                        // process.exit(0)
                    }
                } catch (e) {
                    throw e
                }
            }
        })
    } catch (e) {
        throw e
    }
}

export {
    testKafka
}