"use strict";

function Players(players) {
    this.players = players ? players : new Array();
    this.drawshadows = false;
}

Players.prototype.loadJson = function(json) {
    for (var i = 0; i < json.players.length; i++) {
        this.players.push(new Player().loadJson(json.players[i]));
    }
    return this.players;
}

Players.prototype.addPlayer = function(player) {
    this.players.push(player);
}

Players.prototype.getPlayers = function() {
    return this.players;
}

Players.prototype.sortByHeight = function() {
    this.players.sort(sortByHeight);
}


