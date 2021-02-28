var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var connection=require('./sql_conn');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var hospitalRouter = require('./routes/hospital');
var patientRouter = require('./routes/patient');
// var bloodInfoRouter= require('./routes/bloodinfo');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/signup_login', signup_loginRouter);
app.use('/hospital', hospitalRouter);
app.use('/patient', patientRouter);
// app.use('/hospital/bloodinfo', bloodInfoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//sql 
// var sql='select * from blood_requests;';
// // var sql = 'INSERT INTO users SET ?';
// //   db.query(sql, userDetails,function (err, data) { 
// //       if (err) throw err;
// //          console.log("User dat is inserted successfully "); 
// //   });
// connection.query(sql, function (err, result) {
//   if (err) throw err
//   console.log('The result is: ', result)
// })


app.listen(3000, () => console.log('Example app listening on port 3000!'));

module.exports = app;


