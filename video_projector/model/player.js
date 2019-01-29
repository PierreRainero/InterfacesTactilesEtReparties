function Player(id, state) {
    this.id = id;
    this.state = state;
    this.animations = [];
    this.mixer = null;
    this.modelObject = null;
    this.bounceValue = 0;

    this.updateTrait();
}

Player.prototype.update = function (id, state) {
    if(id)
        this.id = id;
    if(state)
        this.state = state;

    this.updateTrait();

    var animation = game.startTime ? this.animations[0] : this.state === 1 ? this.animations[1] : this.animations[2];
    this.mixer.stopAllAction();
    this.mixer.clipAction(animation).play();
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

Player.prototype.jump = function () {
    this.bounceValue = 25;
    console.log("JUMP");
}

Player.prototype.setBounceValue = function (value) {
    this.bounceValue = value;
}