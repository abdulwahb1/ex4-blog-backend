// const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next();
  };
  
// const userExtractor = (request, response, next) => {
//   const decodedToken = jwt.verify(request.token, process.env.SECRET)
//   if (!decodedToken.id) {
//     request.user = null
//   } else {
//     request.user = decodedToken
//   }
//   next()
// }

  module.exports = {
    tokenExtractor,
    // userExtractor
  }