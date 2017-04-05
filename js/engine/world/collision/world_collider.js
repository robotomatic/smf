"use strict";


function WorldCollider() {

    // todo
    // ---> lookup collisions instead of hunting. we're on a grid so let's use it!!!!
    // ---> this whole collider business is enfuckulated...
    
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
        var player = world.players.players[i];
        this.collideWithWorld(player, world);
    }
}


WorldCollider.prototype.collideWithWorld = function(player, world) { 
    player.resetCollisions();
    player.collider.updateCollisionBox();        
    this.collideWithWorldBounds(player, world);
    this.collideWithWorldPlayers(player, world.players);
    this.collideWithWorldItems(player, this.colliders);
    player.updateLevelCollisions();
}




WorldCollider.prototype.collideWithWorldBounds = function(player, world) { 
    if (player.controller.x < world.bounds.x) {
        player.controller.x = world.bounds.x;
        player.controller.canMoveLeft = false;
    }
    if (player.controller.x + player.controller.width > (world.bounds.x + world.bounds.width)) {
        player.controller.x = (world.bounds.x + world.bounds.width) - player.controller.width;
        player.controller.canMoveRight = false;
    }
    if (player.controller.y < world.bounds.y) {
        player.controller.y = world.bounds.y;
        player.controller.canMoveUp = false;
    }
    if (player.controller.y + player.controller.height > (world.bounds.y + world.bounds.height)) {
        player.info.die();
    }
    if (player.controller.z < world.bounds.z) {
        player.controller.z = world.bounds.z;
        player.controller.canMoveIn = false;
    }
    if (player.controller.z + player.controller.depth > (world.bounds.z + world.bounds.depth)) {
        player.controller.z = (world.bounds.z + world.bounds.depth) - player.controller.depth;
        player.controller.canMoveOut = false;
    }
}

WorldCollider.prototype.collideWithWorldPlayers = function(player, players) { 
//    world.players.collidePlayer(player); 
} 

WorldCollider.prototype.collideWithWorldItems = function(player, items) { 
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        this.collideItem(player, item);
    }
}

WorldCollider.prototype.collideItem = function(player, item) {
    if (item.collide === false) return false;
    var ip = item.getLocation();
    this.box.id = item.id;
    this.box.x = ip.x;
    this.box.y = ip.y;
    this.box.z = ip.z;
    this.box.width = item.width;
    this.box.height = item.height;
    this.box.depth = item.depth;
    this.box.collide = true;
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
    var pad = 50;
    var tpad = pad * 2;
    var spawnitem = null;
    while (spawnitem == null) {
        var r = random(0, t - 1);
        spawnitem = this.colliders[r];
        if (!spawnitem.traversable) spawnitem = null;
        else if (spawnitem.width < tpad || spawnitem.height < pad || spawnitem.depth < tpad) spawnitem = null;
        else if ((!spawnitem.traversable) || (spawnitem.damage && spawnitem.damage.hp > 0)) spawnitem = null;
    }
    var box = spawnitem.getMbr();
    var rpx = random(pad,  box.width - pad) + box.x;
    var rpy = box.y - player.controller.height - 20;
    var rpz = random(pad, box.depth - pad) + box.z;
    player.respawn(rpx, rpy, rpz);
    player.reset();
}

