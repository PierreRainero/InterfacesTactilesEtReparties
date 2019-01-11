var socket = io('http://localhost:8282');

socket.emit('get', { my: 'data' });
socket.emit('start', { my: 'data' });
socket.emit('get', { my: 'data' });

socket.on('news', function (data) {
    console.log(data);

});