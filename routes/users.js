const router = require('express').Router();
const { celebrate, Joi } = require('../node_modules/celebrate');

const {
  getUsers, getUser, updateAvatar, updateProfile,
} = require('../controllers/users');

router.get('/me', celebrate({
  cookies: Joi.object().keys({
    userTocken: Joi.string(),
  }),
}), getUser);

module.exports = router;