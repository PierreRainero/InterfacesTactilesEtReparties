

var socket = io('http://localhost:8282');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});