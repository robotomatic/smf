"use strict";

function PlayerCollider(player) {
    this.levelcollisions = new Array();
    this.player = player;
    this.collisionbox = new Rectangle(0, 0, 0, 0);
    this.lastbox = new Rectangle(0, 0, 0, 0);
    this.movebox = new Rectangle(0, 0, 0, 0);
    
    this.movebox.depth = 0;
    
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
    return result;
};

PlayerCollider.prototype.handleCollide = function(collider, result) {

    if (result.vertical.direction) result = this.handleCollideVertical(collider, result);
    else {
        if (result.horizontal.direction) result = this.handleCollideHorizontal(collider, result);
        if (result.depth.direction) result = this.handleCollideDepth(collider, result);
    }
    
    if (collider.damage) this.handleCollideDamage(collider, result);
    if (collider.gravity || collider.viscosity) result = this.handleCollideLiquid(collider, result);
    
    return result;
}





PlayerCollider.prototype.handleCollideVertical = function(collider, result) {
    var colv = result.vertical;
    var dir = colv.direction;
    var amt = colv.amount;
    var buffer = 1;
    amt = amt > buffer ? amt : 0;
    var color = "cyan";
    if (dir === "b") {
        
        var y = collider.y - this.player.controller.height;
        
        this.player.controller.canMoveDown = false;
        this.player.controller.falling = false;
        
        if (colv.y) {
            this.player.controller.groundpoint.x = round(this.player.controller.x + (this.player.controller.width / 2));
            this.player.controller.groundpoint.y = colv.y;
            this.player.controller.groundpoint.z = this.player.controller.z;

            var dy = round(colv.y - this.player.controller.height);
            this.player.controller.y = dy;
            this.player.controller.lastY = dy;
            
            amt = (this.player.controller.y + this.player.controller.height) - colv.y;
        }
        
        amt = 0;
        
        this.player.controller.jumpstartx = this.player.controller.x;
        this.player.controller.jumpstarty = this.player.controller.y;
        this.player.controller.jumpstartz = this.player.controller.z;
        
        var cy = result.vertical.y ? result.vertical.y : collider.y; 
        
        this.player.controller.lastground = {
            x : this.player.controller.x,
            y : cy,
            z : this.player.controller.z,
            width : collider.width,
            height : collider.height,
            depth : collider.depth,
            ramp : collider.ramp,
            action : collider.action,
            collider : collider, 
            color : color,
            direction : dir,
            amount : amt,
            result : result
        };
        
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
    
    return result;
}


PlayerCollider.prototype.handleCollideHorizontal = function(collider, result) {
    var colh = result.horizontal;
    var dir = colh.direction;
    var amt = colh.amount;
    var buffer = 0;
    amt = amt > buffer ? amt : 0;
    this.player.controller.groundpoint.x = round(this.player.controller.x + (this.player.controller.width / 2));
    if (dir === "l") {
        this.player.controller.canMoveLeft = false;
    } else if (dir === "r") {
        this.player.controller.canMoveRight = false;    
    }

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
    
    return result;
}


PlayerCollider.prototype.handleCollideDepth = function(collider, result) {
    var cold = result.depth;
    var dir = cold.direction;
    var amt = cold.amount;
    var buffer = 0;
    amt = amt > buffer ? amt : 0;
    this.player.controller.groundpoint.z = round(this.player.controller.z + (this.player.controller.depth / 2));
    if (dir === "i") {
        this.player.controller.canMoveIn = false;
    } else if (dir === "o") {
        this.player.controller.canMoveOut = false;    
    }
    
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
    return result;
}









PlayerCollider.prototype.handleCollideDamage = function(collider, result) {
    this.player.info.damage(collider.damage);
}

PlayerCollider.prototype.handleCollideLiquid = function(collider, result) {
    this.player.controller.floating = true;
    this.player.controller.falling = false;
    this.player.controller.grounded = true;
    this.player.controller.jumpstartx = this.player.controller.x;
    this.player.controller.jumpstarty = this.player.controller.y;
    this.player.controller.groundpoint.x = this.player.controller.x + (this.player.controller.width / 2);
    this.player.controller.groundpoint.y = this.player.controller.y + this.player.controller.height;
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
