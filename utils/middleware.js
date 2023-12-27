const jwt = require('jsonwebtoken');
const User = require('../models/user');

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next();
  };
  
  const userExtractor = async (request, response, next) => {
  
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
  
    console.log('from userExtractor', { decodedToken });
  
    if (!decodedToken.id) {
      response.status(401).json({ error: 'token invalid' });
    } else {
      request.user = await User.findById(decodedToken.id);
    }
  
    console.log('from userExtractor - request.user: ', request.user);
  
    next();
  };

  module.exports = {
    tokenExtractor,
    userExtractor
  }