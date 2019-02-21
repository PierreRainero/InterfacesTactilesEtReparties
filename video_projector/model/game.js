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

    if(this.players.playerNumber() === 2){
        document.getElementById("middleSeparation").classList.remove("hidden");
    } else if(!document.getElementById("middleSeparation").classList.contains("hidden")){
        document.getElementById("middleSeparation").classList.add("hidden");
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
    if(value > 0){
        chrono.innerHTML = value;
        if(value === 1) {
            var audio = new Audio('view/running/sounds/start.wav');
            audio.play();
        }
    } else if(value === 0){
        chrono.innerHTML = "C'est parti !";

        var minimap = document.getElementById("minimap");
        minimap.classList.remove("hidden");

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

Game.prototype.stopGame = function(data){
    this.players.finishAll();

    var audio = new Audio('view/running/sounds/end.wav');
    audio.play();

    clearInterval(this.chronoJob);
    var style = `width: 100%; left: 0%`;
    document.getElementById("playersReady").innerHTML += `<div style="${style}">Partie terminée</div>`;
    setTimeout(() => {
        this.displayResults(data);
        document.getElementById("results").classList.remove("hidden");
    }, 1000);
}

Game.prototype.playerNeedToJump = function (id) {
    var taille = 100 / this.players.playerNumber();
    var position = taille*this.players.getPlayerLeftPosition(id);
    var style = `width: ${taille}%; left: ${position}%`;
    document.getElementById("playersReady").innerHTML += `<div id="jump${id}" style="${style}">Sautez !</div>`;
    setTimeout(() => {
        let element = document.getElementById(`jump${id}`);
        element.parentNode.removeChild(element);
    }, 750);
}

Game.prototype.displayResults = function (data) {
    var container = document.getElementById("results");
    container.innerHTML = "";
    for(var i = 0; i < this.players.length(); i++){
        var playerId = 0;
        var name = "Aries Merritt"
        var time = {
            min: 0,
            sec: 12,
            millisec: 80
        };
        var averageHeartbeat = 0;
        var averageSpeed = 30.9;
        var hurdlesAvoided = 10;
        var maxHeartbeat = 0;
        var minHeartbeat = 0;

        for(let result of data){
            if(result.playerId !== 0 && result.playerId === this.players.get(i).id){
                playerId = result.playerId;
                name = `Joueur ${result.playerId}`;
                time = result.time;
                averageHeartbeat = Math.round(result.averageHeartbeat);
                averageSpeed = Math.round(((result.averageSpeed * 3600) / 1000)*100)/100;
                hurdlesAvoided = 0;
                for(let hurdle of result.hurdlesAvoided){
                    if(hurdle)
                        hurdlesAvoided++;
                }
                maxHeartbeat = result.maxHeartbeat;
                minHeartbeat = result.minHeartbeat;
            }
        }

        var taille = 100 / this.players.length();
        var position = 0 + taille*i;
        var style = `width: ${taille}%; left: ${position}%`;
        container.innerHTML += `<div style="${style}" class="resultsCol">
            <div class="resultsCard" style="background-color: ${playerId === 0 ? "#ffff00" : playerId === 1 ? " #CD5C5C" : "#1E90FF"}">
                <div class="resultsName">${name}</div>
                <div class="resultsTitle">${playerId === 0 ? "Détenteur du record du monde" : ""}</div>
                <div class="resultsTime">Temps : ${time.min !== 0 ? `${time.min}m ` : ""}${time.sec}s ${time.millisec}</div>
                <div class="resultsAverageSpeed">Vitesse moyenne : ${averageSpeed}km/h</div>
                ${averageHeartbeat !== 0 ? `<div class="resultsAverageHeartbeat">Battements cardiaque moyens : ${averageHeartbeat}</div>` : ""}
                ${minHeartbeat !== 0 ? `<div class="resultsMinHeartbeat">Battements cardiaque minimum : ${minHeartbeat}</div>` : ""}
                ${maxHeartbeat !== 0 ? `<div class="resultsMaxHeartbeat">Battements cardiaque maximum : ${maxHeartbeat}</div>` : ""}
                <div class="resultsHurdlesAvoided">Haies passées : ${hurdlesAvoided}/10</div>
            </div>
        </div>`;
    }
}

Game.prototype.restart = function(){
    this.players = new Players();
    this.startTime = null;
    this.hurdles = [];
    this.chronoJob = null;
    clearRunners();
    document.getElementById("results").classList.add("hidden");
    document.getElementById("minimap").classList.add("hidden");
    if(!document.getElementById("middleSeparation").classList.contains("hidden")){
        document.getElementById("middleSeparation").classList.add("hidden");
    }
    this.clearPlayerReadyText();
    document.getElementById("chrono").innerHTML = "";
    document.getElementById("heartbeatPlayer1").innerHTML = "";
    document.getElementById("heartbeatPlayer2").innerHTML = "";
}