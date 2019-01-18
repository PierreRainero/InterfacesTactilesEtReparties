const Player = require('./player.js');

let players;
let state = "waiting_players";
let actions = {};

module.exports = {

    start: function (data, projectorSocket) {
        state = "running";
    },

    definePlayers: function (data, projectorSocket) {
        players = new Array();
        for(const player of data) {
            players.push(new Player(player.id));
            console.log("Player "+player.id+" is ready !");
        }
        
        if(projectorSocket!==null) {
            // @TODO
            // Emit the list of players to the projector
        }
    },

    getState: function (){
        return state;
    }

};
