/*let timer = new Timer();
timer.start();
timer.addEventListener('secondsUpdated', function (e) {
    $('#basicUsage').html(timer.getTimeValues().toString());
});*/
const Player = require('./player.js');

module.exports = class Timer {
    constructor() {
    }
    startCountdown(){
        var chrono = document.getElementById("chrono");
        if(this.arePlayersReady()) {
            chrono.innerHTML = "3";
            setTimeout(() => {
                if (this.arePlayersReady()) {
                    chrono.innerHTML = "2";
                    setTimeout(() => {
                        if (this.arePlayersReady()) {
                            chrono.innerHTML = "1";
                            setTimeout(() => {
                                if (this.arePlayersReady()) {
                                    this.clearPlayerReadyText();
                                    chrono.innerHTML = "C'est parti !";
                                    this.startTime = new Date();
                                    startRunning();
                                    setTimeout(() => {
                                        setInterval(() => {
                                            chrono.innerHTML = this.getCurrentTime();
                                        }, 1);
                                    }, 500);
                                } else {
                                    chrono.innerHTML = "";
                                }
                            }, 1000);
                        } else {
                            chrono.innerHTML = "";
                        }
                    }, 1000);
                } else {
                    chrono.innerHTML = "";
                }
            }, 1000);
        } else {
            chrono.innerHTML = "";
        }
    }
};