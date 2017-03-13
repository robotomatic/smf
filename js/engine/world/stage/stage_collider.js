"use strict";

function StageCollider() {
    
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

//    this.collisionindex = null;
//    this.index = {
//        x : 0,
//        y : 0,
//        z : 0
//    };
    
}

StageCollider.prototype.addCollider = function(c) {
    this.colliders.push(c);
//    this.addColliderIndex(c);
}



StageCollider.prototype.addColliderIndex = function(c) {
//    var index = this.getColliderIndex(c);
}


StageCollider.prototype.getColliderIndex = function(c) {
//    return this.getColliderIndexAtPoint(c.x, c.y, c.z);
}

StageCollider.prototype.getPlayerColliderIndex = function(p) {
//    return this.getColliderIndexAtPoint(p.controller.x, p.controller.y, p.controller.z);
}


StageCollider.prototype.getColliderIndexAtPoint = function(x, y, z) {
//    var ix = x - this.index.bounds.minx;
//    var index_x = floor(ix / this.index.size.width);
//    
//    var iy = y - this.miny;
//    var index_y = floor(iy / this.index.size.height);
//    
//    var iz = z - this.minz;
//    var index_z = floor(iz / this.index.size.depth);
//
//    this.index.out.x = index_x;
//    this.index.out.y = index_y;
//    this.index.out.z = index_z;
//    
//    return this.index.out;
}



StageCollider.prototype.logIndex = function() {
}









StageCollider.prototype.collide = function(stage) {
    if (!stage.players) return; 
    var t = stage.players.players.length;
    for (var i = 0; i < t; i++) {
        var p = stage.players.players[i];
        
        updateDevPlayerIndex(this.getPlayerColliderIndex(p));
        
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

