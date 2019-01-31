var socket = io('http://192.168.43.238:8282');

socket.emit('connectProjector');

/*
//TEST ZONE
setTimeout(() => {
    game.setPlayers([{id: 1, state: 1}]);
    setTimeout(() => {
        game.setPlayers([{id: 1, state: 1},{id: 2, state: 1}]);
        setTimeout(() => {
            game.setPlayers([{id: 1, state: 2},{id: 2, state: 1}]);
            setTimeout(() => {
                game.setPlayers([{id: 1, state: 2},{id: 2, state: 2}]);
                setTimeout(() => {
                    game.setCountdown(3);
                    setTimeout(() => {
                        game.setCountdown(2);
                        setTimeout(() => {
                            game.setCountdown(1);
                            setTimeout(() => {
                                game.setCountdown(0);
                                setTimeout(() => {
                                    game.playerJump(1);
                                }, 3000);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 5000);
        }, 5000);
    }, 5000);
}, 5000);
*/

socket.on('playerChange', function (data) {
    console.log("Player change received, data : ", data);
    game.setPlayers(data);
});

socket.on('countdown', function (data){
    console.log("Countdown received, data : ", data);
    game.setCountdown(data.value);
});

socket.on('hurdles', function (data){
    console.log("Hurdles received : ", data);
    game.setHurdles(data);
});

socket.on('playerJump', function (data){
    console.log("Player jump received, data : ", data);
    game.playerJump(data.playerId);
});

socket.on('updatePlayers', function (data) {
    console.log("updatePlayers received, data : ", data);
});

socket.on('heartbeat', function (data) {
    console.log("heartbeat received, data : ", data);
    game.updateHeartbeat(data.playerId, data.heartbeatValue);
});

socket.on('gameFinished', function () {
    console.log("Game finished received");
})