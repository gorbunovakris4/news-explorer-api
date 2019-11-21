const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const AuthorizationError = require('../errors/authorization-err');

const { NODE_ENV, JWT_SECRET } = process.env;

function createUser(req, res, next) {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch(() => {
      next(new BadRequestError('Введенные данные не прошли валидацию'));
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Неправильные почта или пароль');
      } else {
        const _id = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res.cookie('jwt', _id, {
          httpOnly: true,
          maxAge: 604800,
          sameSite: true,
        }).end();
      }
    })
    .catch(() => {
      next(new AuthorizationError('Неправильные почта или пароль'));
    });
}

function getUser(req, res, next) {
  User.find({ _id: req.params.userId })
    .then((user) => {
      if (user.length === 0) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch(next);
}

module.exports = {
  login, createUser, getUser,
};
