function Player(id, state) {
    this.id = id;
    this.state = state;
    this.animations = [];
    this.mixer = null;

    this.updateTrait();
}

Player.prototype.update = function (id, state) {
    this.id = id;
    this.state = state;

    this.updateTrait();
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