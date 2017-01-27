"use strict";

function Players(players) {
    this.players = players ? players : new Array();
    this.image = new Image(null, 0, 0, 0, 0);
    this.shadow = {
        draw : true,
        canvas : null,
        ctx : null,
        width : 20,
        height : 5
    };
    this.debug = false;
    this.mbr = new Rectangle(0, 0, 0, 0);
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


Players.prototype.getMbr = function(mbr) {
    var minx, miny, maxx, maxy, minz;
    var t = this.players.length;
    for (var i = 0; i < t; i++) {
        var player = this.players[i];
        if (!player) continue;
        var item = this.players[i].getMbr();
        if (!minx || item.x <= minx) minx = item.x;
        if (!miny || item.y <= miny) miny = item.y;
        if (!maxx || item.x + item.width >= maxx) maxx = item.x + item.width;
        if (!maxy || item.y + item.height >= maxy) maxy = item.y + item.height;
        if (!minz || item.z <= minz) minz = item.z;
    }
    if (!mbr) mbr = new Rectangle(0, 0, 0, 0);
    mbr.x = minx;
    mbr.y = miny;
    mbr.z = minz;
    mbr.width = maxx - minx;
    mbr.height = maxy - miny;
    mbr.x = round(mbr.x);
    mbr.y = round(mbr.y);
    mbr.z = round(mbr.z);
    mbr.width = round(mbr.width);
    mbr.height =  round(mbr.height);
    this.mbr.x = mbr.x;
    this.mbr.y = mbr.y;
    this.mbr.z = mbr.z;
    return mbr;
}

Players.prototype.sortByHeight = function() {
    this.players.sort(sortByHeight);
}

Players.prototype.renderPlayer = function(now, window, graphics, player, quality, floodlevel) {
    if (!player) return;
    var scale = window.scale;
    player.smooth(now, scale);
    player.translate(window, graphics.width, graphics.height);
    player.draw(now, window, graphics.ctx, scale, quality, floodlevel, this.debug);            
}

Players.prototype.collidePlayer = function(player) {
//        for (var i = 0; i < this.players.players.length; i++) {
//            var p = this.players.players[i];
//            if (p===player) continue;
//            player.collideWith(p);
//        }
//    }
}