const jwt = require('jsonwebtoken')



function verifyJwtToken(token, secret, tokenType) {
  try {
    const payload = jwt.verify(token, secret, {
      issuer: 'auth-service'
    })

    if (!payload.sub){ 
      throw new Error('TOKEN_MISSING_SUB') 
    }

    if (!payload.identifier || !payload.identifierType) {
      throw new Error('TOKEN_MISSING_IDENTITY')
    }

    if (!payload.role) {
      throw new Error('TOKEN_MISSING_ROLE')
    }

    return {
      id: payload.sub,
      identifier: payload.identifier,
      identifierType: payload.identifierType,
      role: payload.role,

      tokenType,
      issuedAt: payload.iat,
      expiresAt: payload.exp
    }

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      const e = new Error('TOKEN_EXPIRED')
      e.code = 'TOKEN_EXPIRED'
      throw e
    }

    if (err.name === 'JsonWebTokenError') {
      const e = new Error('TOKEN_INVALID')
      e.code = 'TOKEN_INVALID'
      throw e
    }

    throw err
  }
}


exports.verifyAccessToken = (token) => {
  return verifyJwtToken( token, process.env.ACCESS_TOKEN_SECRET, 'access_token' )
}


exports.verifyToken = exports.verifyAccessToken
