const express = require('express');
const path = require('path');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session');
app.use(session({
  name: 'sid',
  secret: process.env['SESSION_SECRET'],
  resave: false,
  saveUninitialized: true,
}));

app.use('/', require('./controllers/matchmaker'));
app.use('/game', require('./controllers/game'));
app.use('/results', require('./controllers/results'));

// catch 404 and forward to error handler
app.use(function(request, response, next) {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// error handler
app.use(function(error, request, response) {
  // set locals, only providing error in development
  response.locals.message = error.message;
  response.locals.error = request.app.get('env') === 'development' ? error : {};

  // render the error page
  response.status(error.status || 500);
  response.render('error');
});

module.exports = app;
