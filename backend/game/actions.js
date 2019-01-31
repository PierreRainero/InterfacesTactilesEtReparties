const Player = require('./player.js');
const Map = require ('./map.js');

let players;
let state = "waiting_players";
let kinect;
let projector;
let smartphone;
let map = new Map();


module.exports = {

    start: function () {
        state = "running";
    },

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
        kinect = kinectSocket;
        projector = projectorSocket;
        smartphone = smartphoneSocket;

        if(players.length == 0){
            for(const player of data) {
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
        projectorSocket.emit('playerChange', players);
        
        if(this.isPlayersReady() && projectorSocket && kinectSocket) {
            this.startCountdown();
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
    },

    getState: function (){
        return state;
    },

    checkJump: function (playerId){
        if(players[playerId].isApproachingHurdle(map)){

        }
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

                                    let updateJob = setInterval(() => {
                                        let needUpdate = false;
                                        let everyoneFinished = true;
                                        for(let player of players){
                                            let result = player.addProgress(0.00275);
                                            needUpdate = result !== null;
                                            if(!player.finish)
                                                everyoneFinished = false;
                                        }
                                        if(needUpdate)
                                            projector.emit('updatePlayers', players);
                                        if(everyoneFinished) {
                                            projector.emit('gameFinished');
                                            clearInterval(updateJob);
                                        }
                                    }, 1);

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
