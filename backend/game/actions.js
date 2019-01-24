const Player = require('./player.js');

let players;
let state = "waiting_players";
let actions = {};

module.exports = {

    start: function (data, projectorSocket) {
        state = "running";
    },

    
  /**
   * Update the list of players for the next game
   * @param data object which contains all players
   * @param kinectSocket socket to communicate with the kinect
   * @param projectorSocket socket to communicate with the projector
   */
    definePlayers: function (data, kinectSocket, projectorSocket) {
        players = new Array();
        for(const player of data) {
            players.push(new Player(player.id, player.state));
            projectorSocket.emit('playerChange', data);
        }
        
        if(this.isPlayersReady() && projectorSocket && kinectSocket) {
            projectorSocket.emit('everyonesReady', players);
            kinectSocket.emit('kinectStartRun', 'Ready');
        }
    },

    /**
     * Check if all players of the next game are ready to start
     * @return "true" if the kinect says every players are ready, "false" otherwise
     */
    isPlayersReady: function () {
        let playersReady = true;
        for(const player of players) {
            if(player.state !== 2){
                playersReady = false;
            }
        }

        return playersReady;
    },

    getState: function (){
        return state;
    }

};
