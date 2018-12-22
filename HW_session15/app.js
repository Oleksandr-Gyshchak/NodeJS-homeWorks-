const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');

require('./configs/mongo');

const passport = require('passport');
require('./configs/passport.config')(passport);


const indexRouter = require('./routes/index');
const profileRouter = require('./routes/profile');
const notificationsRouter = require('./routes/notifications');
const loginRouter = require('./routes/login');
const apiRouter = require('./routes/api');
const signUpRouter = require('./routes/signup');
const signUpLoginApiRouter = require('./routes/signUpLoginApi');



const app = express();

app.use(passport.initialize());


app.set(path.join(__dirname, 'views'));
app.set("view engine", "hbs");


app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/profile', profileRouter);
app.use('/notifications', notificationsRouter);
app.use('/login', loginRouter);
app.use('/signup', signUpRouter);

app.use('/login-api', signUpLoginApiRouter);

app.use('/api', apiRouter);


// catch 404 and forward to error handler
/*
app.use((req, res, next) => {
    next(createError(404));
});

*/

app.use(function (err, req, res, next) {
    console.error(err.message);
    res.status(err.status || 500).json({
        error: err.message
    });
});


/*

// error handler
app.use((err, req, res, next) => {
    console.log('error handler' - err);

 
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // if (err.name === 'MongoError' && err.code === 11000) {
    //   return res.status(409).send({ success: false, message: 'user already exist!' });
    // }

    // render the error page
    res.status(err.status || 500);
    res.json({
        success: false,
        message: err.message
    });

});
*/

module.exports = app;