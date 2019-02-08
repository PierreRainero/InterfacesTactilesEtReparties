var socket = io('http://172.20.10.7:8282');

socket.emit('connectProjector');


//TEST ZONE
game.setHurdles([13.72, 22.86, 32, 41.14, 50.28, 59.42, 68.56, 77.7, 86.84, 95.98]);
setTimeout(() => {
    game.setPlayers([{id: 0, state: 2, bot: true},{id: 1, state: 1}]);
    setTimeout(() => {
        game.setPlayers([{id: 0, state: 2, bot: true},{id: 1, state: 1},{id: 2, state: 1}]);
        setTimeout(() => {
            game.setPlayers([{id: 0, state: 2, bot: true},{id: 1, state: 2},{id: 2, state: 1}]);
            setTimeout(() => {
                game.setPlayers([{id: 0, state: 2, bot: true},{id: 1, state: 2},{id: 2, state: 2}]);
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
                                let position = 0;
                                setInterval(() => {
                                    if(position < 110){
                                        position += 0.4;
                                        game.setPlayers([{id: 0, state: 2, bot: true, progress: position},{id: 1, state: 2, progress: position},{id: 2, state: 2, progress: position}]);
                                    }
                                }, 1);
                                setTimeout(() => {
                                    hurdlesObject[1][0].fall = true;
                                }, 5000);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 5000);
        }, 5000);
    }, 5000);
}, 5000);


socket.on('playerChange', function (data) {
    //console.log("Player change received, data : ", data);
    game.setPlayers(data);
});

socket.on('countdown', function (data){
    //console.log("Countdown received, data : ", data);
    game.setCountdown(data.value);
});

socket.on('hurdles', function (data){
    //console.log("Hurdles received : ", data);
    game.setHurdles(data);
});

socket.on('playerJump', function (data){
    //console.log("Player jump received, data : ", data);
    game.playerJump(data.playerId);
});

socket.on('updatePlayers', function (data) {
    //console.log("updatePlayers received, data : ", data);
    game.setPlayers(data);
});

socket.on('collision', function (data) {
    //console.log("collision detected, player : ", data);
    hurdlesObject[data.playerId][data.hurdleId].fall = true;
});

socket.on('gameFinished', function (data) {
    //console.log("Game finished received, data : ", data);
    game.stopGame(data);
});