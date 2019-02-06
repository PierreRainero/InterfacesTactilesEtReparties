function Players() {
    this.players = [];
}

Players.prototype.add = function(player){
    var position = this.positionOf(player.id);
    if(position !== null)
        this.players[position].update(player.id, player.state, player.progress, player.finish, player.heartbeat, player.bot);
    else
        this.players.push(new Player(player.id, player.state, player.bot));
}

Players.prototype.positionOf = function(id){
    for(var [index, player] of this.players.entries()){
        if(player.id === id)
            return index;
    }
    return null;
}

Players.prototype.get = function(i){
    return this.players[i];
}

Players.prototype.getPlayer = function(i){
    return this.getPlayers()[i];
}

Players.prototype.getPlayers = function(){
    let result = [];
    for(let player of this.players){
        if(!player.bot)
            result.push(player);
    }
    return result;
}

Players.prototype.length = function(){
    return this.players.length;
}

Players.prototype.playerNumber = function() {
    let result = 0;
    for(let player of this.players){
        if(!player.bot)
            result++;
    }
    return result;
}

Players.prototype.update = function () {
    for(var player of this.players){
        player.update();
    }
}