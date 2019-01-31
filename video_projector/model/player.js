function Player(id, state) {
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

    this.updateTrait();
}

Player.prototype.update = function (id, state, progress, finish) {
    if(id)
        this.id = id;
    if(state)
        this.state = state;
    if(progress)
        this.progress = progress;
    if(finish)
        this.finish = finish;

    this.updateTrait();

    var animation = this.chooseAnimation();
    if(this.currentAnimation !== animation) {
        this.currentAnimation = animation;
        this.mixer.stopAllAction();
        this.mixer.clipAction(this.currentAnimation).play();
    }
}

Player.prototype.updateTrait = function () {
    switch(this.id){
        case 1:
            this.model = "runner_red";
            this.backgroundColor = "rgb(92, 205, 205)";
            break;
        case 2:
            this.model = "runner_blue";
            this.backgroundColor = "rgb(255, 141, 30)";
            break;
        default:
            this.model = "runner_base";
            this.backgroundColor = "rgb(0, 0, 0)";
            break;
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
    console.log("JUMP");
}

Player.prototype.setBounceValue = function (value) {
    this.bounceValue = value;
}

Player.prototype.chooseAnimation = function(){
    if(game.startTime) {
        if(this.finish)
            return this.animations[1];
        else
            return this.animations[0];
    } else {
        if(this.state === 1)
            return this.animations[1];
        else
            return this.animations[2];
    }
}