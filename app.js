const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

// Configure passport
require('./passport');

const app = express();

// Set up mongoose connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);
app.use('/auth', authRouter);

module.exports = app;
