const rateLimit = require('express-rate-limit')


module.exports = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message:{
    success:false,
    message:'Too many requests, slow down'
  },
  standardHeaders:true,
  legacyHeaders:false
})
