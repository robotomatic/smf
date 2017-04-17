"use strict";

function WorldCollider() {
    this.bounds = {
        min : {
            x : null,
            y : 0,
            z : null
        },
        max : {
            x : null,
            y : null,
            z : null
        }
    };
    this.collisionindex = new WorldColliderIndex();
    
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
}



WorldCollider.prototype.reset = function() {
    this.bounds.min.x = null;
    this.bounds.min.y = null;
    this.bounds.min.z = null;
    this.bounds.max.x = null;
    this.bounds.max.y = null;
    this.bounds.max.z = null;
    this.collisionindex.reset();

    this.colliders.length = 0;
    this.collider = new Collider();
}





















WorldCollider.prototype.addCollider = function(c, args) {
    this.colliders.push(c);
    this.checkBounds(c);
    this.addColliderIndex(c, args);
}

WorldCollider.prototype.checkBounds = function(c) {
    if (c.width == "100%" || c.height == "100%" || c.depth == "100%") return;
    if (this.bounds.min.x == null || c.x < this.bounds.min.x) this.bounds.min.x = c.x;
    if (this.bounds.max.x == null || c.x + c.width > this.bounds.max.x) this.bounds.max.x = c.x + c.width;
    if (c.y < this.bounds.min.y) this.bounds.min.y = c.y;
    if (this.bounds.max.y == null || c.y + c.height > this.bounds.max.y) this.bounds.max.y = c.y + c.height;
    if (this.bounds.min.z == null || c.z < this.bounds.min.z) this.bounds.min.z = c.z;
    if (this.bounds.max.z == null || c.z + c.depth > this.bounds.max.z) this.bounds.max.z = c.z + c.depth;
}



WorldCollider.prototype.addColliderIndex = function(c, args) {
    this.collisionindex.indexCollider(c, args);
}

WorldCollider.prototype.getColliderIndex = function(collider, result) {
    return this.collisionindex.getColliderIndex(collider, result);
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
    this.getColliderIndex(player.controller, player.collider.index);
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
    var pad = 10;
    var tpad = pad * 2;
    var spawnitem = null;
    while (spawnitem == null) {
        var r = random(0, t - 1);
        spawnitem = this.colliders[r];
        if (!spawnitem.traversable) spawnitem = null;
  
// todo --> trouble here...        
//        else if (spawnitem.width < tpad || spawnitem.height < pad || spawnitem.depth < tpad) spawnitem = null;
        
        else if ((!spawnitem.traversable) || (spawnitem.damage && spawnitem.damage.hp > 0)) spawnitem = null;
    }
    var box = spawnitem.getMbr();
    var rpx = random(pad,  box.width - pad) + box.x;
    var rpy = box.y - player.controller.height - 20;
    var rpz = random(pad, box.depth - pad) + box.z;
    player.respawn(rpx, rpy, rpz);
    player.reset();
}

