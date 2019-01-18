const Player = require('./player.js');


let state = "waiting_players";
let actions = {};

module.exports = {

    start: function (data, projectorSocket) {
        state = "running";
        const players = new Array();
        for(const player of data) {
            players.push(new Player(player.color));
            console.log("Player "+player.color+" is ready !");
        }
        console.log(players);
        projectorSocket.emit('gameStart', players);
    },

    getState: function (){
        return state;
    }

};
