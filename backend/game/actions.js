const Player = require('./player.js');
const map = require ('./map.js');

let players;
let state = "waiting_players";
let kinect;
let projector;
let smartphone;

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

        for(const newPlayer of data){
            const playerId = this.findPlayerIndexById(newPlayer.id);
            if(playerId !== -1){
                players[playerId].state = newPlayer.state;
            }else{
                players.push(new Player(newPlayer.id, newPlayer.state));
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
                // red === 1, blue === 2
                if (player.id == watch.playerId) {
                    player.setWatchCaptor(watch.deviceID, watch.dataSharing);
                }
            }
        }
    },

    /**
     * Received heartbeat from smartphone and send it to projector
     * @param {array} data 
     */
    heartbeatReceived: function(data) {
        if(!players){
            return;
        }

        for (const watch of data) {
            for (const player of players) {
                if (player.id === watch.playerId) {
                    player.setHeartbeat(watch.heartbeat);
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

    /**
     * Search the index of a player using his id
     * @param {number} idToSearch of the player to search
     * @return {number} number corresponding of his index if this player exists, -1 otherwise
     */
    findPlayerIndexById: function(idToSearch) {
        return players.map(function (player) {
            return player.id;
        }).indexOf(idToSearch);
    },

    getState: function (){
        return state;
    },

    playerJump: function (playerId){
        players[this.findPlayerIndexById(playerId)].jump(map);
    },

    updatePlayersSpeed: function(players){
        for(const player of players){
            console.log("Player "+player.id+" run at "+player.speed+" m/s");
            players[this.findPlayerIndexById(player.id)].updateSpeed(player.speed);
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
                                        let result = player.addProgress(player.speed/1000);
                                        let hurdleTouched = player.checkCollision(map);
                                        if(hurdleTouched !== null){
                                            projector.emit('collision', {playerId:player.id, hurdleId: hurdleTouched});
                                        }
                                        needUpdate = result !== null;
                                        if(!player.finish)
                                            everyoneFinished = false;
                                    }
                                    if(needUpdate)
                                        projector.emit('updatePlayers', players);
                                    if(everyoneFinished) {
                                        projector.emit('gameFinished', players);
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
