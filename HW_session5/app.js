var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var setlog = require('./middlewares/requestLoger')
var getListRouter = require('./routes/getList');


var app = express();

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


//loger
app.use(setlog.requestLoger);
// execution time
app.use(
  function (req, res, next) {
    var start = new Date();
    const startTime = process.hrtime();
    var simulateTime = 4;

    res.on("finish", () => {
      setTimeout(function () {
        var end = new Date() - start,
          hrend = process.hrtime(startTime);

        console.info('Execution time: %dms', end);
        console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
      }, simulateTime);

    });
    next();
  }

)

// api 

app.use('/getList', getListRouter);




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
//module.exports = app;