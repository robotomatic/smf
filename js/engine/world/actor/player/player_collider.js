"use strict";

function PlayerCollider(player) {
    this.levelcollisions = new Array();
    this.player = player;
    this.collisionbox = geometryfactory.getRectangle(0, 0, 0, 0);
    this.lastbox = geometryfactory.getRectangle(0, 0, 0, 0);
    this.movebox = geometryfactory.getRectangle(0, 0, 0, 0);
    this.movebox.depth = 0;
    this.result = null;
    this.updateCollisionBox();
}

PlayerCollider.prototype.reset = function() {
    this.levelcollisions.length = 0;
    this.collisionbox.reset();
    this.lastbox.reset();
    this.movebox.reset();
}

PlayerCollider.prototype.respawn = function() {
    this.updateCollisionBox();
}

PlayerCollider.prototype.collideWith = function(collider, result) {
    if (collider == null) return result;
    result = collide(this.movebox, collider, result);
    if (result.collided()) result = this.handleCollide(collider, result);
    this.result = result;
    return result;
};





/*

todo:

- collide with parts is wrong: 
    ---> can bump head on invisible ceiling
    ---> can land on invisible ceiling
    
- need to resolve collisions correctly:
    ---> solve y then check if x and z are still a thing

- collisions fucked on ramps
    ---> missing last top? need to fix builder so it includes non-double paths
    
- fix render order 
    ---> ( bottom -> top -> middle ) render order
    ---> add non-poly item parts support which also needs ( y -> z -> x ) render order

- make item tops into new item

- make grass go deep

- make sure little hero dude doesn't spawn inside things
    ---> need to find (and fix) all geometry intersection points
    ---> create list of traversable surfaces


*/








PlayerCollider.prototype.handleCollide = function(collider, result) {
    result = this.handleCollideVertical(collider, result);
//    result = this.handleCollideHorizontal(collider, result);
//    result = this.handleCollideDepth(collider, result);
    if (collider.damage) this.handleCollideDamage(collider, result);
    if (collider.gravity || collider.viscosity) result = this.handleCollideLiquid(collider, result);
    return result;
}

PlayerCollider.prototype.handleCollideVertical = function(collider, result) {
    var colv = result.vertical;
    var dir = colv.direction;
    if (dir) {
        var amt = colv.amount;
        var buffer = 1;
        amt = amt > buffer ? amt : 0;
        var color = "cyan";
        if (dir === "b") {
            this.player.controller.canMoveDown = false;
            this.player.controller.falling = false;
            if (colv.y) {
                var dy = round(colv.y - this.player.controller.height);
                this.player.controller.y = dy;
                this.player.controller.lastY = dy;
            }
            this.player.controller.touchFloor(amt);
            color = "purple";
        } else if (dir === "t") {
            this.player.controller.canMoveUp = false;
            this.player.controller.touchRoof(amt);
            color = "blue";
        }
        this.levelcollisions[this.levelcollisions.length] = {
            item : collider,
            x : collider.x,
            y : collider.y,
            z : collider.z,
            width : collider.width,
            height : collider.height,
            depth : collider.depth,
            ramp : collider.ramp,
            color : color,
            direction : dir,
            amount : amt
        }
    }
    result.y = 0;
    return result;
}

PlayerCollider.prototype.handleCollideHorizontal = function(collider, result) {
    var colh = result.horizontal;
    var dir = colh.direction;
    var amt = colh.amount;
    var buffer = 0;
    amt = amt > buffer ? amt : 0;
    if (dir) {
        if (dir === "l") this.player.controller.canMoveLeft = false;
        else if (dir === "r") this.player.controller.canMoveRight = false;    
        this.player.controller.touchWall(dir, amt);
        this.levelcollisions[this.levelcollisions.length] = {
            item : collider,
            x : collider.x,
            y : collider.y,
            z : collider.z,
            width : collider.width,
            height : collider.height,
            depth : collider.depth,
            ramp : collider.ramp,
            color : "white",
            direction : dir,
            amount : amt
        }
    }
    return result;
}


PlayerCollider.prototype.handleCollideDepth = function(collider, result) {
    var cold = result.depth;
    var dir = cold.direction;
    if (dir) {
        var amt = cold.amount;
        var buffer = 0;
        amt = amt > buffer ? amt : 0;
        if (dir === "i") this.player.controller.canMoveIn = false;
        else if (dir === "o") this.player.controller.canMoveOut = false;    
        this.player.controller.touchWall(dir, amt);
        this.levelcollisions[this.levelcollisions.length] = {
            item : collider,
            x : collider.x,
            y : collider.y,
            z : collider.z,
            width : collider.width,
            height : collider.height,
            depth : collider.depth,
            ramp : collider.ramp,
            color : "white",
            direction : dir,
            amount : amt
        }
    }
    return result;
}









PlayerCollider.prototype.handleCollideDamage = function(collider, result) {
    this.player.info.damage(collider.damage);
}

PlayerCollider.prototype.handleCollideLiquid = function(collider, result) {
    this.player.controller.floating = true;
    this.player.controller.falling = false;
    this.player.controller.grounded = true;
    return result;
}


PlayerCollider.prototype.updateCollisionBox = function() {
    
    var player = this.player;
    
    var ppx = player.controller.x;
    var ppy = player.controller.y;
    var ppz = player.controller.z;
    
    this.lastbox.x = this.collisionbox.x;
    this.lastbox.y = this.collisionbox.y;
    this.lastbox.z = this.collisionbox.z;
    this.lastbox.width = this.collisionbox.width;
    this.lastbox.height = this.collisionbox.height;

    this.collisionbox.x = ppx;
    this.collisionbox.y = ppy;
    this.collisionbox.z = ppz;
    this.collisionbox.width = player.controller.width;
    this.collisionbox.height = player.controller.height;

    this.collisionbox.velX = player.controller.velX;
    this.collisionbox.velY = player.controller.velY;
    this.collisionbox.velZ = player.controller.velZ;
    
    if (!this.lastbox.x) this.lastbox.x = this.collisionbox.x;
    if (!this.lastbox.y) this.lastbox.y = this.collisionbox.y;
    if (!this.lastbox.z) this.lastbox.z = this.collisionbox.z;
    if (!this.lastbox.width) this.lastbox.width = this.collisionbox.width;
    if (!this.lastbox.height) this.lastbox.height = this.collisionbox.height;
    
    var x1 = Math.min(this.lastbox.x, this.collisionbox.x);
    var y1 = Math.min(this.lastbox.y, this.collisionbox.y);
    var z1 = Math.min(this.lastbox.z, this.collisionbox.z);
    var x2 = Math.max(this.lastbox.x, this.collisionbox.x);
    var y2 = Math.max(this.lastbox.y, this.collisionbox.y);
    var z2 = Math.max(this.lastbox.z, this.collisionbox.z);
    
    this.movebox.x = x1;
    this.movebox.y = y1;
    this.movebox.z = z1;
    this.movebox.width = round(x2 - x1 + player.controller.width);
    this.movebox.height = round(y2 - y1 + player.controller.height);
    this.movebox.velX = player.controller.velX;
    this.movebox.velY = player.controller.velY;
    this.movebox.velZ = player.controller.velZ;
}

PlayerCollider.prototype.getBottomItem = function() {
    var t = this.levelcollisions.length;
    for (var i = 0; i < t; i++) {
        var c = this.levelcollisions[i];
        if (c.direction == "b") return c;
    }
    return null;
}
