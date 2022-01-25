const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    const error = new Error('Não autenticado');
    error.statusCode = 401;
    next(error);
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  dotenv.config();
  try {
    decodedToken = jwt.verify(token, process.env.JWT_PASS);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Não autenticado');
    error.statusCode = 401;
    next(error);
  }

  req.userId = decodedToken.userId;
  
  next();
};
