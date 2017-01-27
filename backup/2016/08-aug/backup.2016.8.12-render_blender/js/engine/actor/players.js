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
    var t = this.players.length;
    for (var i = 0; i < t; i++) {
        var player = this.players[i];
        if (!player) continue;
        
        var item = this.players[i].camera.camerabox;
        
        if (!minx || item.x <= minx) minx = item.x;
        if (!miny || item.y <= miny) miny = item.y;
        if (!maxx || item.x + item.width >= maxx) maxx = item.x + item.width;
        if (!maxy || item.y + item.height >= maxy) maxy = item.y + item.height;
    }
    if (!mbr) mbr = new Rectangle(0, 0, 0, 0);
    
    mbr.x = minx - (pad / 2);
    mbr.y = miny - (pad / 2);
    mbr.width = maxx - minx + pad;
    mbr.height = maxy - miny + pad;
    
//    mbr.x = round(mbr.x);
//    mbr.y = round(mbr.y);
//    mbr.width = round(mbr.width);
//    mbr.height =  round(mbr.height);
    
    return mbr;
}

Players.prototype.sortByHeight = function() {
    this.players.sort(sortByHeight);
}


    
Players.prototype.renderPlayer = function(now, window, ctx, player, x, y, scale, quality) {

    // todooooooo: shadders
    
    if (!player) return;

    player.smooth(now, scale);
    
    // todo: this needs to be quadtree!!!!
    //if (!collideRough(window, player.camera.camerabox)) return;
    
    var pw = player.controller.width * scale;
    var ph = player.controller.height * scale;
    
    pw = round(pw);
    ph = round(ph);
    
    var pp = player.controller.getLocation();
    var px = pp.x;
    var py = pp.y;

//    var px = player.controller.x;
//    var py = player.controller.y;

    px = (px - x) * scale;
    py = (py - y) * scale;
    
    
    px = round(px);
    py = round(py);

    
    var c = player.collider.getBottomItem();
    if (c) {
        if (c.depth > 0) py -= 2 * scale;        
        if (c.z) {
            
            // todo: this is fuckapated
            
            var wc = window.getCenter();
            var p1 = new Point(px + (pw / 2), py + ph);
            var np = new Point(0, 0);
            np = projectPoint3D(p1, c.z * scale, scale, x, y, wc, np);
            px = np.x - (pw / 2);
            py = np.y - ph;
            py -= 2 * scale;
        }
    }
    
    
    // todo: need to get theme and check if theme overrides item depth!!!!
    
    //player.translate(px, py);
    
    player.draw(now, ctx, px, py, pw, ph, scale, quality);            
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
    sx = round(sx);
    sy = round(sy);
    
    var sw = mbr.width * scale;
    var sh = mbr.height * scale;
    sw = round(sw);
    sh = round(sh);
    
    this.shadow.canvas.width = sw;
    this.shadow.canvas.height = sh;
    
    clearRect(this.shadow.ctx, 0, 0, sw, sh);
    
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
    rx = round(rx);
    ry = round(ry);
    
    var rw = this.shadow.width * scale;
    if (rw < pw) rw = pw;
    rw = round(rw);
    var rwo = rw / 2;
    
    var rrx = rx - rwo;
    rrx = round(rrx);
    
    var rh = this.shadow.height * scale;
    rh = round(rh);
    var ryo = rh / 3;

    var rry = ry - ryo;
    rry = round(rry);
    
    var srect = new Rectangle(rrx, rry, rw, rh);
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