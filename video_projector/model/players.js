function Players() {
    this.players = [];
}

Players.prototype.add = function(player){
    var position = this.positionOf(player.id);
    console.log(position);
    if(position !== null)
        this.players[position].update(player.id, player.state);
    else
        this.players.push(new Player(player.id, player.state));
    console.log(this.players);
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

Players.prototype.length = function(){
    return this.players.length;
}