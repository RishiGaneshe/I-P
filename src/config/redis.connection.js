const { createClient } = require('redis')

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
})


redisClient.on('error', (err) => {
  console.error('[Redis Error]', err.message)
})

redisClient.on('connect', () => {
  console.log('[Redis] connecting...')
})

redisClient.on('ready', () => {
  console.log('[Redis] connected')
})

redisClient.on('reconnecting', () => {
  console.log('[Redis] reconnecting...')
})

redisClient.on('end', () => {
  console.log('[Redis] connection closed')
})


async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect()
    }
    console.log('[Redis] connection established')
  } catch (err) {
    console.error('[Redis] connection failed:', err.message)
    process.exit(1)
  }
}

module.exports = { redisClient, connectRedis }
