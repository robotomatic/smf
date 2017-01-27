"use strict";

function PlayerCollider(player) {
    this.levelcollisions = new Array();
    this.player = player;
    this.collisionbox = new Rectangle(0, 0, 0, 0);
    this.lastbox = new Rectangle(0, 0, 0, 0);
    this.movebox = new Rectangle(0, 0, 0, 0);
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

    if (result.collided()) return this.handleCollide(collider, result);

//    if (!result.vertical.amount) {
//        if (this.player.controller.lastground) {
//            var ph = this.player.controller.y + this.player.controller.height;
//            var d = this.player.controller.lastground.y - ph;
//            if (Math.abs(d) < 2) {
//                this.player.controller.falling = false;
//            } else {
//                this.player.controller.falling = true;
//                this.player.controller.dx = 0;
//                this.player.controller.dy = 0;
//            }
//        } else {
//            this.player.controller.falling = true;
//            this.player.controller.dx = 0;
//            this.player.controller.dy = 0;
//        }
//    }
    
    return result;
};

PlayerCollider.prototype.handleCollide = function(collider, result) {
    if (result.vertical.direction) result = this.handleCollideVertical(collider, result);
    else if (result.horizontal.direction) result = this.handleCollideHorizontal(collider, result);
    if (collider.damage) this.handleCollideDamage(collider, result);
    if (collider.action) this.handleCollideAction(collider, result);
    if (collider.gravity || collider.viscosity) result = this.handleCollideLiquid(collider, result);
    return result;
}

PlayerCollider.prototype.handleCollideAction = function(collider, result) {
    if (collider.action.x) this.handleCollideActionHorizontal(collider, result);
    if (collider.action.y) this.handleCollideActionVertical(collider, result);
}

PlayerCollider.prototype.handleCollideActionHorizontal = function(collider, result) {

    
    var pp = this.player.controller.getLocation();
    var px = pp.x;
    
    if (this.player.controller.velX != 0) {
        this.player.controller.dx = round(px - collider.x);
        return;
    }
    
    if (!this.player.controller.dx) this.player.controller.dx = round(px - collider.x);
    
    this.player.controller.x = round(collider.x + this.player.controller.dx);
    this.player.controller.lastX = this.player.controller.x;
}

PlayerCollider.prototype.handleCollideActionVertical = function(collider, result) {
    // todo: check jump
    // todo: check projection
//    if (collider.action.y) this.player.controller.y = collider.y - this.player.controller.height;
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

            var dy = round(colv.y - this.player.controller.height);
            this.player.controller.y = dy;
            this.player.controller.lastY = dy;
            
            amt = (this.player.controller.y + this.player.controller.height) - colv.y;
            
        } else {
            
            this.player.controller.y = y;
            this.player.controller.lastY = y;
            
            this.player.controller.groundpoint.x = round(this.player.controller.x + (this.player.controller.width / 2));
            this.player.controller.groundpoint.y = y;
        }
        
        amt = 0;
        
        this.player.controller.jumpstartx = this.player.controller.x;
        this.player.controller.jumpstarty = this.player.controller.y;
        
        var cy = result.vertical.y ? result.vertical.y : collider.y; 
        
        this.player.controller.lastground = {
            x : this.player.controller.x,
            y : cy,
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


PlayerCollider.prototype.updateCollisionBox = function() {
    
    var player = this.player;
    
//    var pp = player.getLocation();
//    var ppx = pp.x;
//    var ppy = pp.y;
    
    var ppx = player.controller.x;
    var ppy = player.controller.y;
    
    this.lastbox.x = this.collisionbox.x;
    this.lastbox.y = this.collisionbox.y;
    this.lastbox.width = this.collisionbox.width;
    this.lastbox.height = this.collisionbox.height;

    this.collisionbox.x = ppx;
    this.collisionbox.y = ppy;
    this.collisionbox.width = player.controller.width;
    this.collisionbox.height = player.controller.height;

    this.collisionbox.velX = player.controller.velX;
    this.collisionbox.velY = player.controller.velY;
    
    if (!this.lastbox.x) this.lastbox.x = this.collisionbox.x;
    if (!this.lastbox.y) this.lastbox.y = this.collisionbox.y;
    if (!this.lastbox.width) this.lastbox.width = this.collisionbox.width;
    if (!this.lastbox.height) this.lastbox.height = this.collisionbox.height;
    
    var x1 = Math.min(this.lastbox.x, this.collisionbox.x);
    var y1 = Math.min(this.lastbox.y, this.collisionbox.y);
    var x2 = Math.max(this.lastbox.x, this.collisionbox.x);
    var y2 = Math.max(this.lastbox.y, this.collisionbox.y);
    
    this.movebox.x = x1;
    this.movebox.y = y1;
    this.movebox.width = round(x2 - x1 + player.controller.width);
    this.movebox.height = round(y2 - y1 + player.controller.height);
    this.movebox.velX = player.controller.velX;
    this.movebox.velY = player.controller.velY;
}



PlayerCollider.prototype.getBottomItem = function() {
    var t = this.levelcollisions.length;
    for (var i = 0; i < t; i++) {
        var c = this.levelcollisions[i];
        if (c.direction == "b") return c;
    }
    return null;
}
