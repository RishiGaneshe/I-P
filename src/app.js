
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimiter = require('./middlewares/rateLimiter.middleware')
const path = require('path')

const app = express()


// app.use(helmet())


app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))


app.use(morgan('combined'))

app.use(express.json({ limit: '50kb' }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true, limit: '50kb' }))


app.set('trust proxy', 1) 
app.use(rateLimiter)

app.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'service healthy',
    uptime: process.uptime(),
    timestamp: Date.now()
  })
})

app.use('/', require('./routes/view.routes'))
app.use('/api', require('./routes/profile.routes'))
app.use('/api', require('./routes/search.routes'))


app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'route not found'
  })
})



app.use((err, req, res, next) => {
  console.error('FULL ERROR:', err)
  console.error('STACK:', err?.stack)
  console.error('PARENT:', err?.parent)

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'internal server error'
  })
})

module.exports = app


// 
