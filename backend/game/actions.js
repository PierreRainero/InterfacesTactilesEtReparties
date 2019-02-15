const Player = require('./player.js');
const map = require('./map.js');

let players;
let state = "waiting_players";
let kinect;
let projector;
let smartphone;

module.exports = {

    start: function () {
        state = "running";
    },

    setSmartPhone(smarphoneSocket) {
        smartphone=smarphoneSocket;
    },

    /**
     * Setup configurations to start a new game
     */
    setup: function () {
        players = new Array();
        players.push(new Player(0, 2, true));
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

        for (const newPlayer of data) {
            const playerId = this.findPlayerIndexById(newPlayer.id);
            if (playerId !== -1) {
                players[playerId].state = newPlayer.state;
            } else {
                players.push(new Player(newPlayer.id, newPlayer.state));
            }
        }
        projectorSocket.emit('playerChange', this.playersToDTO());

        if (this.isPlayersReady() && projectorSocket && kinectSocket) {
            this.startCountdown();
        }
    },

    /**
     * Associate watchs to player objects
     * @param {array} data object which contains all watchs
     */
    setWatch: function (data) {
        if(!players || players.length===0){
            smartphone.emit('BACKEND_ERROR', 'Players not ready.');
            return;
        }

        for (const watch of data) {
            for (const player of players) {
                // red === 1, blue === 2
                if (player.id == watch.playerId) {
                    player.setWatchCaptor(watch.deviceID, watch.dataSharing);
                }
            }
        }
        smartphone.emit('playersReady', 'Players are ready.');
    },

    /**
     * Received heartbeat from smartphone and send it to projector
     * @param {array} data 
     */
    heartbeatReceived: function (data) {
        if (!players) {
            return;
        }

        for (const watch of data) {
            for (const player of players) {
                if (player.id === watch.playerId) {
                    player.setHeartbeat(watch.heartbeat);
                    player.heartbeatAverage.value += watch.heartbeat;
                    player.heartbeatAverage.heartbeats++;

                    player.heartbeatAverage.max = watch.heartbeat > player.heartbeatAverage.max ? watch.heartbeat : player.heartbeatAverage;
                    player.heartbeatAverage.min = watch.heartbeat < player.heartbeatAverage.min ? watch.heartbeat : player.heartbeatAverage;
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
    findPlayerIndexById: function (idToSearch) {
        return players.map(function (player) {
            return player.id;
        }).indexOf(idToSearch);
    },

    /**
     * Indicates to the system that a player have jumped
     * @param {number} playerId identifier of the jumper
     */
    playerJump: function (playerId) {
        players[this.findPlayerIndexById(playerId)].jump(map);
    },

    /**
     * Update the current speed of a player
     * @param {array} data object which contains all players id associates to a speed (m/s)
     */
    updatePlayersSpeed: function (data) {
        for (const player of data) {
            const playerObtained = players[this.findPlayerIndexById(player.id)];
            if (!playerObtained.hasJumped) {
                playerObtained.updateSpeed(player.speed);
                playerObtained.speedAverage.value += player.speed;
                playerObtained.speedAverage.speeds++;
            }
        }
    },

    getState: function () {
        return state;
    },

    /**
     * Loop for a run
     */
    gameLoop: function () {
        let updateJob = setInterval(() => {
            if (this.gameIteration()) {
                clearInterval(updateJob);
            }
        }, 6);
    },

    /**
     * Speed and jump detection for each loop game iteration
     */
    gameIteration: function () {
        let everyoneFinished = true;
        for (let player of players) {
            if (!player.bot) {
                //player.addProgress((player.speed / 1000 * 6));
                player.addProgress(0.008596 * 6);
                let hurdleTouched = player.checkCollision(map);
                if (hurdleTouched !== null) {
                    projector.emit('collision', { playerId: player.id, hurdleId: hurdleTouched });
                }
            } else {
                player.addProgress(0.008596 * 6);
                if (player.needToJump(map)) {
                    projector.emit('playerJump', { playerId: player.id });
                }
            }
            if (!player.finish) {
                everyoneFinished = false;
            }
        }

        if (!everyoneFinished) {
            projector.emit('updatePlayers', this.playersToDTO());
        } else {
            projector.emit('gameFinished', this.calculateAverages());
            kinect.emit('gameFinished', "Finished");
            if (smartphone) {
                smartphone.emit('gameFinished', this.calculateAverages());
            }

            setTimeout(function () {
                kinect.emit('kinectRestart', "Ready");
                players = new Array();
            }, 60000);
        }

        return everyoneFinished;
    },

    /**
     * Launch countdown and start the game after 3 seconds
     */
    startCountdown: function () {
        projector.emit('everyonesReady', this.playersToDTO());

        let counter = 3;
        let starter = setInterval(() => {
            if (this.isPlayersReady() && counter === 0) {
                projector.emit('countdown', { value: counter });
                if (smartphone) {
                    smartphone.emit('gameStart', this.playersToDTO());
                }
                kinect.emit('kinectStartRun', 'Ready');
                clearInterval(starter);
                this.gameLoop();
            } else if (!this.isPlayersReady()) {
                clearInterval(starter);
            }

            if (counter > 0) {
                projector.emit('countdown', { value: counter });
                counter--;
            }
        }, 1000);
    },

    /**
     * Remove arrays of data of players
     */
    playersToDTO: function () {
        const res = [];
        for (let player of players) {
            res.push(player.toDTO());
        }
        return res;
    },

    /**
     * Calculs averages for each player
     */
    calculateAverages() {
        const res = [];
        for(let player of players){
            res.push({
                playerId: player.id,
                averageSpeed: player.speedAverage.value/player.speedAverage.speeds,
                averageHearthbeat: player.heartbeatAverage.value/player.heartbeatAverage.heartbeats,
                maxHearthBeat: player.heartbeatAverage.max,
                minHearthBeat: player.heartbeatAverage.min,
                hurdlesAvoided: player.hurdlesAvoided
            });
        }

        return res;
    }
};
