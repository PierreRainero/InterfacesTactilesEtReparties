const Player = require('./player.js');

let players;
let state = "waiting_players";

module.exports = {
    /**
     * Setup configurations to start a new game
     */
    setup: function () {
        players = new Array();
    },

    /**
     * Update the list of players for the next game
     * @param {array} data object which contains all players
     * @param {socketIO} kinectSocket socket to communicate with the kinect
     * @param {socketIO} projectorSocket socket to communicate with the projector
     * @param {socketIO} smartphoneSocket socket to communicate with the wears engine
     */
    definePlayers: function (data, kinectSocket, projectorSocket, smartphoneSocket) {
        if (players.length == 0) {
            for (const player of data) {
                players.push(new Player(player.id, player.state));
            }
        } else {
            for (const player of players) {
                for (const newPlayer of data) {
                    if (player.id == newPlayer.id) {
                        player.state = newPlayer.state;
                    }
                }
            }
        }
        //projectorSocket.emit('playerChange', players);

        /*if (this.isPlayersReady() && projectorSocket && kinectSocket) {
            projectorSocket.emit('everyonesReady', players);
            if (smartphoneSocket) {
                smartphoneSocket.emit('gameStart', players);
            }
            kinectSocket.emit('kinectStartRun', 'Ready');
        }*/
        if(this.isPlayersReady()){
            kinectSocket.emit('kinectStartRun', 'Ready');
        }
    },

    /**
     * Associate watchs to player objects
     * @param {array} data object which contains all watchs
     */
    setWatch: function (data) {
        for (const watch of data) {
            for (const player of players) {
                if (player.id == watch.playerId) { // red === 1, blue === 2
                    player.setWatchCaptor(watch.deviceID, watch.dataSharing);
                }
            }
        }
    },

    /**
     * Check if all players of the next game are ready to start
     * @return {boolean} "true" if the kinect says every players are ready, "false" otherwise
     */
    isPlayersReady: function () {
        let playersReady = true;
        for (const player of players) {
            if (player.state !== 2) {
                playersReady = false;
            }
        }

        return playersReady;
    }
};
