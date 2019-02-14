function Game() {
    this.players = new Players();
    this.startTime = null;
    this.hurdles = [];
    this.chronoJob = null;
}

Game.prototype.setPlayers = function(players){
    var needUpdate = players.length !== this.players.length();

    for(var player of players){
        this.players.add(player);
    }

    if(this.startTime === null)
        this.setPlayerReadyText();

    if(needUpdate){
        createRunners();
    }
};

Game.prototype.setHurdles = function(hurdles){
    this.hurdles = hurdles;
};

Game.prototype.getCurrentTime = function(){
    var current = new Date();
    var diff = current - this.startTime;
    diff = new Date(diff);
    var msec = diff.getMilliseconds()
    var sec = diff.getSeconds()
    var min = diff.getMinutes()
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
    return `${min}:${sec}:${msec}`;
};

Game.prototype.setPlayerReadyText = function(){
    var playersReadyContent = "";
    for(var i = 0; i < this.players.playerNumber(); i++){
        var taille = 100 / this.players.playerNumber();
        var position = 0 + taille*i;
        var style = `width: ${taille}%; left: ${position}%`;
        if(this.players.getPlayer(i).state === 2)
            playersReadyContent += `<div style="${style}">Joueur prêt !</div>`;
        else
            playersReadyContent += `<div style="${style}">Levez la main droite quand vous êtes prêt à jouer</div>`;
    }
    document.getElementById("playersReady").innerHTML = playersReadyContent;
};

Game.prototype.clearPlayerReadyText = function(){
    document.getElementById("playersReady").innerHTML = "";
};

Game.prototype.setCountdown = function(value){
    var chrono = document.getElementById("chrono");
    if(value > 0)
        chrono.innerHTML = value;
    else if(value === 0){
        chrono.innerHTML = "C'est parti !";

        this.startTime = new Date();
        this.players.update();
        setTimeout(() => {
            this.clearPlayerReadyText();
            this.chronoJob = setInterval(() => {
                chrono.innerHTML = this.getCurrentTime();
            }, 1);
        }, 500);
    }
};

Game.prototype.playerJump = function (id) {
    var position = this.players.positionOf(id);

    if(position !== null){
        this.players.get(position).jump();
    }
}

Game.prototype.getRelativePosition = function(position){
    return - position * 400;
}

Game.prototype.stopGame = function(players){
    clearInterval(this.chronoJob);
    this.setPlayers(players);
    //document.getElementById("chrono").innerHTML = "Partie terminée";
}