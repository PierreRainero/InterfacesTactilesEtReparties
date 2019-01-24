const Player = require('./player.js');

let players;
let state = "waiting_players";
let actions = {};

module.exports = {

    start: function (players, projectorSocket, smartphoneSocket) {
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
            //@TODO send players list to projector
        }
        
        if(this.isPlayersReady()) {
            //@TODO start count down (3seconds) then launch the game and emit following message
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

        projectorSocket.emit('gameStart', players);
        smartphoneSocket.emit('gameStart', players);

        return playersReady;
    },

    getState: function (){
        return state;
    }

};
