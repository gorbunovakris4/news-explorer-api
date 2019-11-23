const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getArticles, deleteArticle, createArticle,
} = require('../controllers/articles');

router.get('/', getArticles);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24),
  }),
}), deleteArticle);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required(),
    image: Joi.string().required(),
  }),
}), createArticle);

module.exports = router;
