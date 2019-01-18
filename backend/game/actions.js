const Player = require('./player.js');

let players;
let state = "waiting_players";
let actions = {};

module.exports = {

    start: function (data, projectorSocket) {
        state = "running";
        players = new Array();
        for(const player of data) {
            players.push(new Player(player.id));
            console.log("Player "+player.id+" is ready !");
        }
        
        if(projectorSocket!==null) {
            projectorSocket.emit('gameStart', players);
        }
    },

    getState: function (){
        return state;
    }

};
