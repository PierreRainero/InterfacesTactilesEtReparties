var socket = io('http://192.168.43.238:8282');

socket.emit('hiImTheProjector');

socket.on('gameStart', function (data) {
    console.log("Game start received, data : ", data);
    game.players = data;
    game.startTimerOn(document.getElementById("chrono"));
    startRunning();
});