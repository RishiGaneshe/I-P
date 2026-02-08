const { verifyToken } = require('../helpers/jwt.helper.js')
const { redisClient } = require('../config/redis.connection.js')
const crypto = require('crypto')


const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET


function extractBearerToken(req) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return null
  return header.slice(7).trim()
}


function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}



exports.authenticate = async (req, res, next) => {
  try {
    const rawToken = extractBearerToken(req)
    if (!rawToken) {
      return res.status(401).json({ success: false, errorCode: 'AUTH_TOKEN_MISSING', message: 'Authentication token is required. Protecte API.' })
    }

    const tokenHash = hashToken(rawToken)
    try {
      const isBlacklisted = await redisClient.get(`bl:${tokenHash}`)
      if (isBlacklisted) {
        return res.status(401).json({ success: false, errorCode: 'TOKEN_REVOKED', message: 'You have been logged out. Please log in again.' })
      }
    } catch (err) {
      console.error('[AUTH][REDIS]', err)
      return res.status(503).json({ success: false, errorCode: 'AUTH_DEPENDENCY_FAILURE', message: 'Authentication service unavailable' })
    }

    let payload
    try {
      payload = verifyToken(rawToken, JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ success: false,
        errorCode: err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID',
        message: 'Session time out. Please login again'
      })
    }

    if (!payload?.id) {
      return res.status(401).json({ success: false, errorCode: 'TOKEN_INVALID', message: 'Invalid token payload' })
    }

    req.user = Object.freeze({
      userId: payload.id,
      identifier: payload.identifier,
    })

    next()

  } catch (err) {
    console.error('[AUTH][FATAL]', err)
    return res.status(500).json({ success: false, errorCode: 'AUTH_INTERNAL_ERROR', message: 'Internal authentication error' })
  }
}