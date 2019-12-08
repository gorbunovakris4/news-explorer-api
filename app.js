require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const NotFoundError = require('./errors/not-found-err');
const errorMessages = require('./error_messages.json');

const { PORT = 3000, DB_URL, NODE_ENV } = process.env;
const DB_DEV_URL = require('./config');

const { login, createUser } = require('./controllers/users');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

mongoose.connect(NODE_ENV === 'production' ? DB_URL : DB_DEV_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.use('/users', auth, usersRouter);
app.use('/articles', auth, articlesRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError(errorMessages.notFoundError));
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? errorMessages.serverError
        : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
