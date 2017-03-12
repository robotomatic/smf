"use strict";

function StageCollider() {
    
    this.collideindex = new Array();

    this.minx = 0;
    this.maxx = 0;
    this.miny = 0;
    this.maxy = 0;
    this.minz = 0;
    this.maxz = 0;
    
    this.chunksize = {
        width : 0,
        height : 0,
        depth : 0
    }
    
    this.colliders = new Array();
    this.collider = new Collider();
    this.box = {
        x : null,
        y : null,
        width : null,
        height : null,
        ramp : null,
        collide : null,
        gravity : null,
        viscosity : null,
        damage : null,
        action : null
    };    
    
    this.index = {
        x : 0,
        y : 0,
        z : 0
    };
    
}

StageCollider.prototype.setGranularity = function(g) {
    this.chunksize.width = g.x;
    this.chunksize.height = g.y;
    this.chunksize.depth = g.z;
}

StageCollider.prototype.addCollider = function(c) {
    this.colliders.push(c);
    this.addColliderIndex(c);
}

StageCollider.prototype.checkBounds = function(c) {
    if (c.width == "100%" || c.height == "100%" || c.depth == "100%") return;
    if (!this.minx || c.x < this.minx) this.minx = c.x;
    if (!this.maxx || c.x > this.maxx) this.maxx = c.x;
    if (!this.miny || c.y < this.miny) this.miny = c.y;
    if (!this.maxy || c.y > this.maxy) this.maxy = c.y;
    if (!this.minz || c.z < this.minz) this.minz = c.z;
    if (!this.maxz || c.z > this.maxz) this.maxz = c.z;
}


StageCollider.prototype.addColliderIndex = function(c) {
    var index = this.getColliderIndex(c);
    
}


StageCollider.prototype.getColliderIndex = function(c) {
    return this.getColliderIndexAtPoint(c.x, c.y, c.z);
}

StageCollider.prototype.getPlayerColliderIndex = function(p) {
    return this.getColliderIndexAtPoint(p.controller.x, p.controller.y, p.controller.z);
}



StageCollider.prototype.getColliderIndexAtPoint = function(x, y, z) {
    
    var ix = x - this.minx;
    var index_x = floor(ix / this.chunksize.width);
    
    var iy = y - this.miny;
    var index_y = floor(iy / this.chunksize.height);
    
    var iz = z - this.minz;
    var index_z = floor(iz / this.chunksize.depth);

    this.index.x = index_x;
    this.index.y = index_y;
    this.index.z = index_z;
}



StageCollider.prototype.logIndex = function() {
}









StageCollider.prototype.collide = function(stage) {
    if (!stage.players) return; 
    var t = stage.players.players.length;
    for (var i = 0; i < t; i++) {
        var p = stage.players.players[i];
        
        this.getPlayerColliderIndex(p);
        updateDevPlayerIndex(this.index);
        
        this.collideWithPlayers(stage, p);
        this.collideWithItems(stage, p);
    }
}

StageCollider.prototype.collideWithPlayers = function(stage, player) { 
//    stage.players.collidePlayer(player); 
} 

StageCollider.prototype.collideWithItems = function(stage, player) { 
    player.resetCollisions();
    
    
    
    
    // todo
    // ---> lookup collisions instead of hunting. we're on a grid so let's use it!!!!
    // ---> this whole collider business is enfuckulated...
    // ---> wrap canvas and batch draw calls
    // --->
    // ---> profit..?
    
    
    
    
    this.collideWithCollider(player, stage.level.width, stage.level.height);

    if (player.controller.x < 0) player.controller.x = 0;
    if (player.controller.x + player.controller.width > stage.level.width) player.controller.x = stage.level.width - player.controller.width;
    if (player.controller.y < 0) player.controller.y = 0;
    if (player.controller.y + player.controller.height > stage.level.height) {
        player.info.die();
    }
    player.updateLevelCollisions();
}

StageCollider.prototype.collideWithCollider = function(player, width, height) {
    if (!player) return;
    if (!this.colliders) return;
    for (var i = 0; i < this.colliders.length; i++) {
        var item = this.colliders[i];
        // todo: check if renderer overrides draw
//        if (item.parts) this.collideItemParts(player, item, width, height);
//        else this.collideItem(player, item, width, height);
        this.collideItem(player, item, width, height);
    }
}

StageCollider.prototype.collideItem = function(player, item, width, height) {
    return this.collideItemPart(player, item, item, width, height);
}

StageCollider.prototype.collideItemParts = function(player, item, width, height) {
    var out = false;
    for (var i = 0 ; i < item.parts.length; i++) {
        // todo: can collide rough here, but need item mbr
        var col = this.collideItemPart(player, item, item.parts[i], width, height);
        if (col) out = true;
    }
    return out;
}
    
StageCollider.prototype.collideItemPart = function(player, item, part, width, height) {
    if (part.collide === false) return false;
    var ip = item.getLocation();
    var ix = ip.x;
    var iy = ip.y;
    var px = ix;
    var py = iy;
    if (part.x != ix && part.y != iy) {
        px += part.x;
        py += part.y;
    }
    this.box.x = px
    this.box.y = py;
    this.box.z = item.z;
    this.box.width = part.width == "100%" ? width : part.width;
    this.box.height = part.height == "100%" ? height : part.height;
    this.box.depth = item.depth;
    this.box.id = item.id;
    this.box.ramp = (part.ramp) ? part.ramp : "";
    this.box.collide = (part.collide) ? part.collide : true;
    this.box.gravity = this.gravity;
    this.box.viscosity = this.viscosity;
    this.box.damage = this.damage;
    this.box.action = item.action;
    this.collider.reset();
    this.collider = player.collideWith(this.box, this.collider);
    return true;
}





StageCollider.prototype.resetPlayer = function(player, timeout) {
    player.controller.stop();
    var t = this.colliders.length;
    if (t == 0) return;
    var spawnitem = null;
    while (spawnitem == null) {
        var r = random(0, t - 1);
        spawnitem = this.colliders[r];
        if (spawnitem.width < 50 || spawnitem.height < 50 || spawnitem.depth < 50) spawnitem = null;
    }
    var box = spawnitem.getMbr();
    var rpx = random(box.x + 10, box.x + box.width - 10);
    var rpy = box.y - 20;
    var rpz = random(10, spawnitem.depth - 10) + spawnitem.z;
    player.respawn(rpx, rpy, rpz);
    player.reset();
}

