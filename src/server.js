require('dotenv').config()

const app = require('./app')
const db = require('./models/index')
const { connectDB } = require('./config/db.connection')
const { connectRedis } = require('./config/redis.connection')

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  await connectRedis()
  await db.sequelize.sync({ alter: true })

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
  })
}

start()
