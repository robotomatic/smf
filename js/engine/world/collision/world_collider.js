"use strict";

function WorldCollider() {
    
    this.colliders = new Array();
    
    this.collider = new Collider();
    this.box = {
        x : null,
        y : null,
        width : null,
        height : null,
        ramp : null,
        collide : null,
        properties : null,
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

WorldCollider.prototype.reset = function() {
    this.colliders.length = 0;
    this.collider = new Collider();
}

WorldCollider.prototype.addCollider = function(c) {
    this.colliders.push(c);
//    this.addColliderIndex(c);
}



WorldCollider.prototype.addColliderIndex = function(c) {
//    var index = this.getColliderIndex(c);
}


WorldCollider.prototype.getColliderIndex = function(c) {
//    return this.getColliderIndexAtPoint(c.x, c.y, c.z);
}

WorldCollider.prototype.getPlayerColliderIndex = function(p) {
//    return this.getColliderIndexAtPoint(p.controller.x, p.controller.y, p.controller.z);
}


WorldCollider.prototype.getColliderIndexAtPoint = function(x, y, z) {
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



WorldCollider.prototype.logIndex = function() {
}









WorldCollider.prototype.collide = function(world) {
    if (!world.players) return; 
    var t = world.players.players.length;
    for (var i = 0; i < t; i++) {
        var p = world.players.players[i];
        
        updateDevPlayerIndex(this.getPlayerColliderIndex(p));
        
        this.collideWithPlayers(world, p);
        this.collideWithItems(world, p);
    }
}

WorldCollider.prototype.collideWithPlayers = function(world, player) { 
//    world.players.collidePlayer(player); 
} 

WorldCollider.prototype.collideWithItems = function(world, player) { 
    player.resetCollisions();
    
    
    
    
    // todo
    // ---> lookup collisions instead of hunting. we're on a grid so let's use it!!!!
    // ---> this whole collider business is enfuckulated...
    // ---> wrap canvas and batch draw calls
    // --->
    // ---> profit..?
    
    

    if (player.controller.x < 0) {
        player.controller.x = 0;
        player.controller.canMoveLeft = false;
    }
    if (player.controller.x + player.controller.width > world.level.width) {
        player.controller.x = world.level.width - player.controller.width;
        player.controller.canMoveRight = false;
    }
    if (player.controller.y < 0) {
        player.controller.y = 0;
        player.controller.canMoveUp = false;
    }
    if (player.controller.y + player.controller.height > world.level.height) {
        player.info.die();
    }
    if (player.controller.z < 0) {
        player.controller.z = 0;
        player.controller.canMoveIn = false;
    }
    if (player.controller.z + player.controller.depth > world.level.depth) {
        player.controller.z = world.level.depth - player.controller.depth;
        player.controller.canMoveOut = false;
    }

    player.collider.updateCollisionBox();        
    
    this.collideWithCollider(player, world.level.width, world.level.height);
    
    player.updateLevelCollisions();
}

WorldCollider.prototype.collideWithCollider = function(player, width, height) {
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

WorldCollider.prototype.collideItem = function(player, item, width, height) {
    return this.collideItemPart(player, item, item, width, height);
}

WorldCollider.prototype.collideItemParts = function(player, item, width, height) {
    var out = false;
    for (var i = 0 ; i < item.parts.length; i++) {
        // todo: can collide rough here, but need item mbr
        var col = this.collideItemPart(player, item, item.parts[i], width, height);
        if (col) out = true;
    }
    return out;
}
    
WorldCollider.prototype.collideItemPart = function(player, item, part, width, height) {
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
    
    this.box.damage = item.damage;
    this.box.properties = item.properties;
    
    this.box.action = item.action;
    this.collider.reset();
    this.collider = player.collideWith(this.box, this.collider);
    return true;
}


WorldCollider.prototype.resetPlayers = function(players) {
    if (!players) return;
    var t = players.length;
    for (var i = 0; i < t; i++) {
        this.resetPlayer(players[i]);
    }
}



WorldCollider.prototype.resetPlayer = function(player) {
    player.controller.stop();
    var t = this.colliders.length;
    if (t == 0) return;
    var spawnitem = null;
    while (spawnitem == null) {
        var r = random(0, t - 1);
        spawnitem = this.colliders[r];
        if (!spawnitem.traversable) spawnitem = null;
        else if (spawnitem.width < 50 || spawnitem.height < 50 || spawnitem.depth < 50) spawnitem = null;
        else if ((spawnitem.isbounds && !spawnitem.traversable) || spawnitem.damage && spawnitem.damage.hp > 0) spawnitem = null;
    }
    var box = spawnitem.getMbr();
    var rpx = random(box.x + 10, box.x + box.width - 10);
    var rpy = box.y - player.controller.height - 20;
    var rpz = random(10, spawnitem.depth - 10) + spawnitem.z;
    player.respawn(rpx, rpy, rpz);
    player.reset();
}

