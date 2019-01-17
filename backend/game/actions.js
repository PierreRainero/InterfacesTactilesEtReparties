const Player = require('./player.js');

const players = new Array();
let state = "waiting_players";
let actions = {};

module.exports = {

    start: function (players, projectorSocket) {
        state = "running";
        
        players.forEach(player => {
            players.push(new Player(player.color));
            console.log("Player "+player.color+" is ready !");
        });

        projectorSocket.emit('gameStart', players);
    },

    getState: function (){
        return state;
    }

};
