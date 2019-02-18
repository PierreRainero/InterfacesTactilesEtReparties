function Player(id, state, bot) {
    this.id = id;
    this.state = state;
    this.progress = 0;
    this.finish = false;
    this.animations = [];
    this.mixer = null;
    this.modelObject = null;
    this.shadowObject = null;
    this.cameraObject = null;
    this.bounceValue = 0;
    this.currentAnimation = null;
    this.heartbeat = 0;
    this.bot = bot;
    this.speed = 0;

    this.initMinimap();
    this.updateTrait();
}

Player.prototype.update = function (id, state, progress, finish, heartbeat, bot, speed) {
    if(id)
        this.id = id;
    if(state)
        this.state = state;
    if(progress)
        this.progress = progress;
    if(finish)
        this.finish = finish;
    if (heartbeat)
        this.heartbeat = heartbeat;
    if(bot)
        this.bot = bot;
    this.speed = speed;

    this.updateTrait();
    this.updateHeartbeat();
    this.updateMinimap();

    var animation = this.chooseAnimation();
    if(this.currentAnimation !== animation) {
        this.currentAnimation = animation;
        this.mixer.stopAllAction();
        this.mixer.clipAction(this.currentAnimation).play();
    }
}

Player.prototype.updateTrait = function () {
    switch(this.id){
        case 0:
            this.model = "runner_record";
            break;
        case 1:
            this.model = "runner_red";
            break;
        case 2:
            this.model = "runner_blue";
            break;
        default:
            this.model = "runner_base";
            break;
    }
}

Player.prototype.updateHeartbeat = function() {
    var heartbeatDiv;
    if (this.id === 1 && this.heartbeat != 0) {
        heartbeatDiv = document.getElementById("heartbeatPlayer1");
        heartbeatDiv.innerHTML = "♡" + this.heartbeat;
    } else if (this.id === 2 && this.heartbeat != 0) {
        heartbeatDiv = document.getElementById("heartbeatPlayer2");
        heartbeatDiv.innerHTML = this.heartbeat + "♡";
    }
}

Player.prototype.updateMinimap = function() {
    var percent = (this.progress*95)/110;

    if (this.id === 0){
        document.getElementById("minimap-player1").style.bottom = percent+"%";
    }
    else if (this.id === 1) {
        document.getElementById("minimap-player2").style.bottom = percent+"%";
    }
    else if (this.id === 2) {
        document.getElementById("minimap-player3").style.bottom = percent+"%";
    }

}

Player.prototype.initMinimap = function() {

    if (this.id === 0){
        document.getElementById("minimap-player1").style.backgroundColor = "red";
    }
    else if (this.id === 1) {
        document.getElementById("minimap-player2").style.backgroundColor = "#ffd300";
    }
    else if (this.id === 2) {
        document.getElementById("minimap-player3").style.backgroundColor = "blue";
    }

}



Player.prototype.setAnimations = function (animations) {
    this.animations = animations;
}

Player.prototype.setMixer = function (mixer) {
    this.mixer = mixer;
}

Player.prototype.setModel = function (model) {
    this.modelObject = model;
}

Player.prototype.setShadow = function (shadow) {
    this.shadowObject = shadow;
}

Player.prototype.setCamera = function (camera) {
    this.cameraObject = camera;
}

Player.prototype.jump = function () {
    this.bounceValue = 25;
}

Player.prototype.setBounceValue = function (value) {
    this.bounceValue = value;
}

Player.prototype.chooseAnimation = function(){
    if(this.bounceValue !== 0)
        return this.animations[3];
    if(game.startTime) {
        if(this.finish)
            return this.animations[4];
        else if(!this.bot && this.speed === 0)
            return this.animations[2];
        else
            return this.animations[1];
    } else {
        if(this.state === 1)
            return this.animations[2];
        else
            return this.animations[0];
    }
}