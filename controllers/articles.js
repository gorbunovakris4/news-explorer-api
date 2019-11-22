const Article = require('../models/article');
const BadRequestError = require('../errors/bad-request-err');
const errorMessages = require('../error_messages.json');

function getArticles(req, res, next) {
  Article.find({})
    .populate('user')
    .then((articles) => res.send({ data: articles }))
    .catch(next);
}

function deleteArticle(req, res, next) {
  Article.findOneAndDelete({ _id: req.params.articleId, owner: req.user._id })
    .then((article) => {
      if (!article) {
        throw new BadRequestError(errorMessages.badArticleId);
      }
      res.send({ data: article });
    })
    .catch(next);
}

function createArticle(req, res, next) {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((user) => res.send({ data: user }))
    .catch(next);
}


module.exports = {
  getArticles, createArticle, deleteArticle,
};
