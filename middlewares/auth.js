const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorization-err');
const errorMessages = require('../error_messages.json');

const { NODE_ENV, JWT_SECRET } = process.env;
const JWT_DEV_SECRET = require('../config');

const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError(errorMessages.authorizationError));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET);
  } catch (err) {
    throw new AuthorizationError(errorMessages.authorizationError);
  }
  req.user = { _id: payload._id };
  next();
};
