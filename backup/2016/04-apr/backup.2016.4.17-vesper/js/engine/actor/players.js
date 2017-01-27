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

Players.prototype.getMbr = function(pad, mbr) {
    if (!pad) pad = 0;
    var minx, miny, maxx, maxy;
    for (var i = 0; i < this.players.length; i++) {
        var item = (this.players[i].camerabox) ? this.players[i].camerabox : this.players[i].controller;
        if (!minx || item.x <= minx) minx = item.x;
        if (!miny || item.y <= miny) miny = item.y;
        if (!maxx || item.x + item.width >= maxx) maxx = item.x + item.width;
        if (!maxy || item.y + item.height >= maxy) maxy = item.y + item.height;
    }
    if (mbr) {
        mbr.x = minx - (pad / 2);
        mbr.y = miny - (pad / 2);
        mbr.width = maxx - minx + pad;
        mbr.height = maxy - miny + pad;
    } else mbr = new Rectangle(minx - (pad / 2), miny - (pad / 2), maxx - minx + pad, maxy - miny + pad);
    return mbr;
}

Players.prototype.sortByHeight = function() {
    this.players.sort(sortByHeight);
}

Players.prototype.render = function(now, window, ctx, x, y, scale, quality) {
    if (!this.players || !this.players.length) return; 
    //for (var i = 0; i < this.players.length; i++) this.renderPlayerShadow(now, window, ctx, this.players[i], x, y, scale, quality);
    for (var i = 0; i < this.players.length; i++) this.renderPlayer(now, window, ctx, this.players[i], x, y, scale, quality);
}

Players.prototype.renderPlayer = function(now, window, ctx, player, x, y, scale, quality) {
    if (!player) return;
    
    // todo: this needs to be quadtree!!!!
    if (!collideRough(window, player.camera.camerabox)) return;
    
    var pw = player.controller.width * scale;
    var ph = player.controller.height * scale;

    var px = player.controller.x;
    var py = player.controller.y;
    
    if (!player.controller.lastX) player.controller.lastX = px;
    var dx = (px - player.controller.lastX) / 2;
    
    if (player.controller.velX != 0) {
        if (dx < 0 && player.controller.canMoveLeft || dx > 0 && player.controller.canMoveRight) px = px - dx;    
    }
    player.controller.lastX = px;
    
    if (!player.controller.lastY) player.controller.lastY = py;
    var dy = (py - player.controller.lastY) / 2;
    if (player.controller.velY != 0) {
        if (dy < 0 && player.controller.canMoveUp || dy > 0 && player.controller.canMoveDown) py = py - dy;
    } 
    player.controller.lastY = py;
    
    px = (px - x) * scale;
    py = (py - y) * scale;
    
    player.translate(px, py);
    player.draw(now, ctx, px, py, pw, ph, quality);            
}

Players.prototype.renderPlayerShadow = function(now, window, ctx, player, x, y, scale) {
    
    return;
    
    if (!player) return;
    
    if (player.controller.jumping || player.controller.falling) return;
    
    // todo: project shadow to ground immediately beneath player and scale by distance
    // todo: figure out gradient
    // todo: is there a better mixing mode?
    
    // todo: this needs to be quadtree!!!!
    if (!collideRough(window, player.camera.camerabox)) return;
    
    var pw = player.controller.width * scale;
    var ph = player.controller.height * scale;

    var px = player.controller.x;
    var py = player.controller.y;
    
    if (!player.controller.lastX) player.controller.lastX = px;
    var dx = (px - player.controller.lastX) / 2;
    
    if (player.controller.velX != 0) {
        if (dx < 0 && player.controller.canMoveLeft || dx > 0 && player.controller.canMoveRight) px = px - dx;    
    }
    
    if (!player.controller.lastY) player.controller.lastY = py;
    var dy = (py - player.controller.lastY) / 2;
    if (player.controller.velY != 0) {
        if (dy < 0 && player.controller.canMoveUp || dy > 0 && player.controller.canMoveDown) py = py - dy;
    } 
    
    px = (px - x) * scale;
    py = (py - y) * scale;

    var sh = 12;
    var sy = 5;
    
    var srect = new Rectangle(px, py + ph - sy, pw, sh);
    ctx.beginPath();
    ctx.globalAlpha = .2;
    ctx.fillStyle = "gray";
    srect.drawRound(ctx);
    ctx.globalAlpha = 1;
}

