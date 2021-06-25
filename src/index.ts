import { testKafka } from "./kafka.tron"

const test = async() => {
    console.time('test')
    try {
        await testKafka()
        
    } catch (e) {
        throw e
    } finally {
        console.timeEnd('test')
    }
}

test()