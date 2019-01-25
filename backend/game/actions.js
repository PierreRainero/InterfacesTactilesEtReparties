const Player = require('./player.js');

let players;
let state = "waiting_players";
let actions = {};
let kinect;
let projector;
let smartphone;


module.exports = {

    start: function () {
        state = "running";
    },

    setup: function() {
        players = new Array();
    },

  /**
   * Update the list of players for the next game
   * @param data object which contains all players
   * @param kinectSocket socket to communicate with the kinect
   * @param projectorSocket socket to communicate with the projector
   * @param smartphoneSocket socket to communicate with the wears engine
   */
    definePlayers: function (data, kinectSocket, projectorSocket, smartphoneSocket) {
        kinect = kinectSocket;
        projector = projectorSocket;
        smartphone = smartphoneSocket;

        if(players.length == 0){
            for(const player of data) {
                players.push(new Player(player.id, player.state));
            }
        }else{
            for(const player of players) {
                for(const newPlayer of data){
                    if(player.id == newPlayer.id){
                        player.state = newPlayer.state;
                    }
                }
            }
        }
        projectorSocket.emit('playerChange', players);
        
        if(this.isPlayersReady() && projectorSocket && kinectSocket) {
            this.startCountdown();
        }
    },

    setWatch: function(data) {
        for(const watch of data) {
            for(const player of players) {
                if(player.id == watch.playerId){ // red === 1, blue === 2
                    player.setWatchCaptor(watch.deviceID, watch.dataSharing);
                }
            }
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
    },

    startCountdown: function (){

        projector.emit('everyonesReady', players);

        projector.emit('countdown', {value:3});

            setTimeout(() => {
                if (this.isPlayersReady()) {
                    projector.emit('countdown', {value:2});

                    setTimeout(() => {
                        if (this.isPlayersReady()) {
                            projector.emit('countdown', {value:1});

                            setTimeout(() => {
                                if (this.isPlayersReady()) {
                                    if (smartphone) {
                                        smartphone.emit('gameStart', players);
                                    }
                                    kinect.emit('kinectStartRun', 'Ready');
                                    projector.emit('countdown', {value:0});

                                } else {
                                    // un joueur quite
                                }
                            }, 1000);
                        } else {
                            // un joueur quite
                        }
                    }, 1000);
                } else {
                    // un joueur quite
                }
            }, 1000);
    }

};
