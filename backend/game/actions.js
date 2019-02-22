const Player = require('./player.js');
const map = require('./map.js');

let players;
let state = "waiting_players";
let kinect;
let projector;
let smartphone;

let startTime = null;

module.exports = {

    start: function () {
        state = "running";
    },

    setSmartPhone(smarphoneSocket) {
        smartphone = smarphoneSocket;
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
        for (const watch of data) {
            for (const player of players) {
                // red === 1, blue === 2
                if (player.id == watch.playerId) {
                    player.setWatchCaptor(watch.deviceID);
                }
            }
        }
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
        startTime = new Date();
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
                player.addProgress((player.speed / 1000*6));
                //player.addProgress(0.008596 * 6);
                if (player.needToJump(map)) {
                    projector.emit('playerNeedToJump', { playerId: player.id });
                }
                let hurdleTouched = player.checkCollision(map);
                if (hurdleTouched !== null) {
                    projector.emit('collision', { playerId: player.id, hurdleId: hurdleTouched });
                    if (smartphone) {
                        smartphone.emit('collision', { playerId: player.id });
                    }
                }
            } else {
                player.addProgress(0.0086 * 6);
                if (player.needToJumpBot(map)) {
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
                smartphone.emit('gameFinished', this.calculateAverages())
            }

            setTimeout((function () {
                kinect.emit('kinectRestart', "Ready");
                projector.emit('projectorRestart');
                if (smartphone) {
                    smartphone.emit('watchRestart', "Ready");
                }
                this.setup();
            }).bind(this), 60000);
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
        let botPlayer;
        for (let player of players) {
            if(player.bot){
                botPlayer = player.toDTO();
            } else {
                res.push(player.toDTO());
            }
        }

        res.splice(Math.floor(players.length/2), 0, botPlayer);
        return res;
    },

    /**
     * Calculs averages for each player
     */
    calculateAverages() {
        const res = [];
        for (let player of players) {
            let averageSpeed = 0;
            if(player.speedAverage.speeds > 0){
                averageSpeed = player.speedAverage.value / player.speedAverage.speeds;
            }
            let averageHeartbeat = 0;
            if(player.heartbeatAverage.heartbeats > 0){
                averageHeartbeat = player.heartbeatAverage.value / player.heartbeatAverage.heartbeats;
            }
            let time = this.dateDiff(startTime, player.finishTime);
            res.push({
                playerId: player.id,
                time: time,
                averageSpeed: averageSpeed,
                averageHeartbeat: averageHeartbeat,
                maxHeartbeat: player.heartbeatAverage.max,
                minHeartbeat: player.heartbeatAverage.min,
                hurdlesAvoided: player.hurdlesAvoided
            });
        }

        return res;
    },

    dateDiff(date1, date2){
        var diff = {};
        var tmp = date2 - date1;

        diff.millisec = tmp % 1000;

        tmp = Math.floor(tmp/1000);
        diff.sec = tmp % 60;

        tmp = Math.floor((tmp-diff.sec)/60);
        diff.min = tmp % 60;

        tmp = Math.floor((tmp-diff.min)/60);
        diff.hour = tmp % 24;

        tmp = Math.floor((tmp-diff.hour)/24);
        diff.day = tmp;

        return diff;
    }
};
