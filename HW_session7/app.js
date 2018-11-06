var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require("hbs");

var indexRouter = require('./routes/index');
var profileRouter = require('./routes/profile');
var docsRouter = require('./routes/docs');
var loginRouter = require('./routes/login');

var app = express();

hbs.registerPartials(__dirname + "/views/partials");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//api
app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/profile', profileRouter);
app.use('/docs', docsRouter);
app.use('/login', loginRouter);


//app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



// 
const port = 3000;
app.listen(port, () => console.log(`listening ${port}`));
//module.exports = app;с