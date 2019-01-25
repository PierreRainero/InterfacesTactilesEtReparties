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
                    game.players = [{id: 1, state: 2},{id: 2, state: 2}];
                    //game.startTimer();

                    setTimeout(() => {
                        game.setCountdown(3);
                        setTimeout(() => {
                            game.setCountdown(2);
                            setTimeout(() => {
                                game.setCountdown(1);
                                setTimeout(() => {
                                    game.setCountdown(0);
                                }, 500);
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

socket.on('everyonesReady', function (data) {
    console.log("Everyone's ready received, data : ", data);
    game.players = data;
});

socket.on('countdown', function (data){
    game.setCountdown(data.value);
});