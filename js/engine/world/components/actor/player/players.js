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
    this.mbr = new Rectangle(0, 0, 0, 0);
    this.camera = {
        count : 0,
        player : null
    }
}

Players.prototype.loadJson = function(json) {
    for (var i = 0; i < json.players.length; i++) {
        this.players.push(new Player().loadJson(json.players[i]));
    }
    return this.players;
}



Players.prototype.addPlayer = function(player) {
    
    var tot = 0;
    var t = this.players.length;
    for (var i = 0; i < t; i++) {
        var p = this.players[i];
        if (p.name == player.name) tot++;
    }
    player.uid =player.name + "-" + tot;
    
    this.players.push(player);
    updateDevPlayers(this.players);
}

Players.prototype.removePlayer = function(player) {
    var t = this.players.length;
    for (var i = 0; i < t; i++) {
        var p = this.players[i];
        if (p == player) {
            p.delete();
            p = null;
            this.players.splice(i, 1);
            break;
        }
    }
    updateDevPlayers(this.players);
}



Players.prototype.getPlayers = function() {
    return this.players;
}

Players.prototype.pause = function(when) { 
    var t = this.players.length;
    for (var i = 0; i < t; i++) {
        var player = this.players[i];
        if (!player) continue;
        player.pause(when);
    }
}

Players.prototype.resume = function(when) { 
    var t = this.players.length;
    for (var i = 0; i < t; i++) {
        var player = this.players[i];
        if (!player) continue;
        player.resume(when);
    }
}

Players.prototype.reset = function(when) { 
    var t = this.players.length;
    for (var i = 0; i < t; i++) {
        var player = this.players[i];
        if (!player) continue;
        player.reset(when);
    }
}

Players.prototype.update = function(when, delta, paused) {
    updateDevPlayers(this.players);
}

Players.prototype.follow = function() {
    if (!this.players.length) return;
    var f = false;
    for (var i = 0; i < this.players.length; i++) {
        var player = this.players[i];
        if (!player) continue;
        if (!player.getscamera) continue;
        if (!player.camera.ready) continue;
        f = true;
        break;
    }
    if (!f) this.players[0].getscamera = true;
}

Players.prototype.unfollow = function() {
    if (!this.players.length) return;
    for (var i = 0; i < this.players.length; i++) {
        var player = this.players[i];
        if (!player) continue;
        player.getscamera = false;
    }
}




Players.prototype.getMbr = function(mbr) {
    var minx, miny, maxx, maxy, minz, maxz;
    
    var found = false;
    this.camera.count = 0;
    this.camera.player = null;
    var t = this.players.length;
    for (var i = 0; i < t; i++) {
        var player = this.players[i];
        if (!player) continue;
        if (!player.getscamera) continue;
        if (!player.camera.ready) continue;
        this.camera.count++;
        var item = player.getMbr();
        found = true;
        if (!this.camera.player) this.camera.player = player;
        if (!minx || item.x <= minx) minx = item.x;
        if (!miny || item.y <= miny) miny = item.y;
        if (!maxx || item.x + item.width >= maxx) maxx = item.x + item.width;
        if (!maxy || item.y + item.height >= maxy) maxy = item.y + item.height;
        if (!minz || item.z <= minz) minz = item.z;
        if (!maxz || item.z + item.depth >= maxz) maxz = item.z + item.depth;
    }
    
    if (!found) {
        mbr.reset();
        return mbr;
    }
    
    if (!mbr) mbr = geometryfactory.getRectangle(0, 0, 0, 0);
    mbr.x = minx;
    mbr.y = miny;
    mbr.z = minz;
    mbr.width = maxx - minx;
    mbr.height = maxy - miny;
    mbr.depth = maxz - minz;
    mbr.x = round(mbr.x);
    mbr.y = round(mbr.y);
    mbr.z = round(mbr.z);
    mbr.width = round(mbr.width);
    mbr.height =  round(mbr.height);
    mbr.depth =  round(mbr.depth);
    this.mbr.x = mbr.x;
    this.mbr.y = mbr.y;
    this.mbr.z = mbr.z;
    return mbr;
}

Players.prototype.sortByHeight = function() {
    this.players.sort(sortByHeight);
}

Players.prototype.collidePlayer = function(player) {
//        for (var i = 0; i < this.players.players.length; i++) {
//            var p = this.players.players[i];
//            if (p===player) continue;
//            player.collideWith(p);
//        }
//    }
}