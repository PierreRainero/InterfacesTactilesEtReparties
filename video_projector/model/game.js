function Game() {
    this.players = [];
    this.startTime = null;
}

Game.prototype.setPlayers = function(players){
    this.players = players;
    this.setPlayerReadyText();
    startRunning();
};

Game.prototype.getCurrentTime = function(){
    var current = new Date();
    var diff = current - this.startTime;
    diff = new Date(diff);
    var msec = diff.getMilliseconds()
    var sec = diff.getSeconds()
    var min = diff.getMinutes()
    var hr = diff.getHours()-1
    if (min < 10){
        min = "0" + min
    }
    if (sec < 10){
        sec = "0" + sec
    }
    if(msec < 10){
        msec = "00" +msec
    }
    else if(msec < 100){
        msec = "0" +msec
    }
    return `${hr}:${min}:${sec}:${msec}`;
};

Game.prototype.getPlayerBackgroundColor = function(id){
    switch(id){
        case 1:
            return "rgb(92, 205, 205)";
        case 2:
            return "rgb(255, 141, 30)";
        default:
            return "rgb(0, 0, 0)";
    }
};

Game.prototype.getPlayerModel = function(id){
    switch(id){
        case 1:
            return "runner_red";
        case 2:
            return "runner_blue";
        default:
            return "runner_base";
    }
};

Game.prototype.setPlayerReadyText = function(){
    var playersReadyContent = "";
    for(var i = 0; i < this.players.length; i++){
        var taille = 100 / this.players.length;
        var position = 0 + taille*i;
        var style = `width: ${taille}%; left: ${position}%`;
        if(this.players[i].state === 2)
            playersReadyContent += `<div style="${style}">Joueur prêt !</div>`;
        else
            playersReadyContent += `<div style="${style}">Levez la main droite quand vous êtes prêt à jouer</div>`;
    }
    document.getElementById("playersReady").innerHTML = playersReadyContent;
};

Game.prototype.clearPlayerReadyText = function(){
    document.getElementById("playersReady").innerHTML = "";
};

Game.prototype.arePlayersReady = function(){
    for(var player of this.players){
        if(player.state !== 2){
            return false;
        }
    }
    return true;
};

Game.prototype.setCountdown = function(value){
    var chrono = document.getElementById("chrono");
    if(value > 0)
        chrono.innerHTML = value;

    else if(value === 0){
        chrono.innerHTML = "C'est parti !"

        this.startTime = new Date();
        startRunning();
        setTimeout(() => {
            setInterval(() => {
                chrono.innerHTML = this.getCurrentTime();
            }, 1);
        }, 500);
    }
};