var socket = io('http://localhost:8282');

game.players.push("Test1", "Test2", "Test3");

socket.emit('get', { my: 'data' });
socket.emit('start', { my: 'data' });
socket.emit('get', { my: 'data' });

socket.on('news', function (data) {
    console.log(data);

});