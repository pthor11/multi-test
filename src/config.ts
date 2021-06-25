import { config } from "dotenv";

config()

const KAFKA_BROKERS = process.env.KAFKA_BROKERS
const KAFKA_TOPIC = process.env.KAFKA_TOPIC
const KAFKA_FILTER = process.env.KAFKA_FILTER


export {
    KAFKA_BROKERS,
    KAFKA_TOPIC,
    KAFKA_FILTER
}