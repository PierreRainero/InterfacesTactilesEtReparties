var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var sessionRouter = require('./routes/session');

let game = require('./game/actions.js');
let map = require('./game/map.js');

var app = express();

app.set('port', process.env.PORT || 3000);

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8282);
var raceLabel;

/**
 * Get label of the race if option is used
 */
const labelFlagIndex = process.argv.indexOf('--label');
if(labelFlagIndex>-1){
  if(process.argv.length>=labelFlagIndex+2){
    raceLabel = process.argv[labelFlagIndex+1];
  }else{
    throw 'Flag "--label" should be follow by a value, ex : npm start -- --label museeSportNice';
  }
}

var projectorSocket = null;
var smartphoneSocket = null;

io.on('connection', function (socket) {
  socket.on('connectProjector', function (){
    console.log('Projector ready.');
    projectorSocket = socket;
    projectorSocket.emit('hurdles', map.getHurdles());
  });

  socket.on('smartphoneConnect', function() {
    console.log('Smartphone connected.');
    smartphoneSocket = socket;
    game.setSmartPhone(smartphoneSocket);
  })

  socket.on('kinectConnected', function (kinect) {
    console.log('Kinect '+kinect.state+'.');
    game.setup(raceLabel);
    kinectSocket = socket;
  });

  socket.on('kinectPlayerJump', function (jumper) {
    game.playerJump(jumper.playerId);
    projectorSocket.emit('playerJump', jumper);
  });

  socket.on('kinectPlayerSpeed', function (data) {
    game.updatePlayersSpeed(data.players);
  });

  socket.on('players', function (data) {
    game.definePlayers(data.players, kinectSocket, projectorSocket, smartphoneSocket);
  });

  socket.on('watchConfigurations', function(data) {
    game.setWatch(data);
  });

  socket.on('heartbeat', function(data) {
    game.heartbeatReceived(JSON.parse(data));
  });

  socket.on('PING', function(data) {
  });
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/session', sessionRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
