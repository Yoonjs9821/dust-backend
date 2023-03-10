var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mapRouter = require('./routes/map');
var oauthRouter = require('./routes/oauth');
var chatRouter = require('./routes/chat');
var datagoRouter = require('./routes/datago');

var app = express();
const cors = require("cors");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// port setup
app.set('port', process.env.PORT || 9000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/map', mapRouter);
app.use('/oauth', oauthRouter);
app.use('/chat', chatRouter);
app.use('/datago', datagoRouter);

const myCorsOptions = {
  origin: function(origin, callback){
    if ("http://localhost:3000".indexOf(origin) !== -1){
      callback(null, true);
    } else {
      callback(new Error("Not Allowed Origin !!!"));
    }
  }
}
app.use(cors(myCorsOptions)); // cors 옵션 추가.

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

module.exports = app;

var server = app.listen(app.get('port'), function() {  
	console.log('Express server listening on port ' + server.address().port);  
});

var listen = require('socket.io');
var io = listen(server);
require('./libs/socketConnection')(io);