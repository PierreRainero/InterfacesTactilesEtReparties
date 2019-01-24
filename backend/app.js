var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var sessionRouter = require('./routes/session');

let game = require('./game/actions.js');

var app = express();

app.set('port', process.env.PORT || 3000);

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8282);

var projectorSocket = null;
var smartphoneSocket = null;

io.on('connection', function (socket) {
  socket.on('hiImTheProjector', function (){
    console.log('Projector ready.');
    projectorSocket = socket;
  });

  socket.on('hiImTheSmartphone', function() {
    smartphoneSocket = socket;
    console.log('smartphone connected')
  })

  socket.on('kinectConnected', function (kinect) {
    console.log('Kinect '+kinect.state+'.');
    kinectSocket = socket;
  });

  socket.on('players', function (data) {
    game.definePlayers(data.players, kinectSocket, projectorSocket);
  });

  socket.on('dataWatch', function(data) {
    console.log(data);
  })

  socket.on('get', function (data) {
    socket.emit('news', game.getState());
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/session', sessionRouter);

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
