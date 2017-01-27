"use strict";

function Players(players) {
    this.players = players ? players : new Array();
    this.shadow = {
        draw : true,
        canvas : null,
        ctx : null,
        width : 20,
        height : 5
    };
    
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
        if (!this.players[i]) continue;
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
    this.smoothPlayers(now, scale);
    if (this.shadow.draw) this.renderShadows(now, window, ctx, x, y, scale);
    this.renderPlayers(now, window, ctx, x, y, scale, quality);
}

Players.prototype.smoothPlayers = function(now, scale) {
    for (var i = 0; i < this.players.length; i++) this.smoothPlayer(now, this.players[i], scale);
}
    
Players.prototype.smoothPlayer = function(now, player, scale) {
    if (!player) return;
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
}
    
Players.prototype.renderPlayers = function(now, window, ctx, x, y, scale, quality) {
    for (var i = 0; i < this.players.length; i++) this.renderPlayer(now, window, ctx, this.players[i], x, y, scale, quality);
}
    
Players.prototype.renderPlayer = function(now, window, ctx, player, x, y, scale, quality) {
    if (!player) return;

    // todo: this needs to be quadtree!!!!
    if (!collideRough(window, player.camera.camerabox)) return;

    var pw = clamp(player.controller.width * scale);
    var ph = clamp(player.controller.height * scale);
    
    var px = player.controller.lastX;
    var py = player.controller.lastY;
    
    px = clamp((px - x) * scale);
    py = clamp((py - y) * scale);
    
    //player.translate(px, py);
    
    player.draw(now, ctx, px, py, pw, ph, quality);            
}

Players.prototype.renderShadows = function(now, window, ctx, x, y, scale) {
    if (!this.shadow.canvas) {
        this.shadow.canvas = document.createElement('canvas');
        this.shadow.ctx = this.shadow.canvas.getContext("2d");
    }
    var mbr = this.getMbr();
    mbr.pad(50);
    var sx = (mbr.x - x) * scale;
    var sy = (mbr.y - y) * scale;
    var sw = mbr.width * scale;
    var sh = mbr.height * scale;
    this.shadow.canvas.width = sw;
    this.shadow.canvas.height = sh;
    this.shadow.ctx.fillStyle = "#969191";
    for (var i = 0; i < this.players.length; i++) this.renderPlayerShadow(now, window, this.shadow.ctx, mbr, x, y, this.players[i], scale);
    ctx.globalAlpha = .3;
    ctx.drawImage(this.shadow.canvas, sx, sy, sw, sh);
    ctx.globalAlpha = 1;
}
    
Players.prototype.renderPlayerShadow = function(now, window, ctx, mbr, x, y, player, scale) {
    if (!player) return;

    // todo: this needs to be quadtree!!!!
    if (!collideRough(window, player.camera.camerabox)) return;
    
    // todo: project shadow to ground immediately beneath player and scale by distance
    if (player.controller.jumping || player.controller.falling) return;
    
    // todo: figure out gradient
    
    var pw = player.controller.width * scale;
    var ph = player.controller.height * scale;
    var px = player.controller.lastX * scale;
    var py = player.controller.lastY * scale;
    var sx = mbr.x * scale;
    var sy = mbr.y * scale;
    
    var rx = (px - sx) + (pw / 2);
    var ry = (py - sy) + ph;
    
    var rw = this.shadow.width * scale;
    if (rw < pw) rw = pw;
    var rwo = rw / 2;
    
    var rh = this.shadow.height * scale;
    var ryo = rh / 3;
    
    var srect = new Rectangle(rx - rwo, ry - ryo, rw, rh);
    srect.drawSmooth(ctx);
}

Players.prototype.collidePlayer = function(player) {
//        for (var i = 0; i < this.players.players.length; i++) {
//            var p = this.players.players[i];
//            if (p===player) continue;
//            player.collideWith(p);
//        }
//    }
}