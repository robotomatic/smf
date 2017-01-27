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



PlayerCollider.prototype.collideWith = function(player, collider, result) {

    if (collider == null) return result;
    
    result = collide(this.movebox, collider, result);

    if (result.collided()) return this.handleCollide(player, collider, result);

    if (!result.vertical.amount) {
        if (player.controller.lastground) {
            var ph = player.controller.y + player.controller.height;
            var d = player.controller.lastground.y - ph;
            if (Math.abs(d) < 2) {
                player.controller.falling = false;
            } else {
                player.controller.falling = true;
                player.controller.dx = 0;
                player.controller.dy = 0;
            }
        } else {
            player.controller.falling = true;
            player.controller.dx = 0;
            player.controller.dy = 0;
        }
    }
    return result;
};

PlayerCollider.prototype.handleCollide = function(player, collider, result) {
    if (result.vertical.amount) result = this.handleCollideVertical(player, collider, result);
    else if (result.horizontal.amount) result = this.handleCollideHorizontal(player, collider, result);
    if (collider.damage) this.handleCollideDamage(player, collider, result);
    if (collider.action) this.handleCollideAction(player, collider, result);
    else {
        player.controller.dx = 0;
        player.controller.dy = 0;
    }
    if (collider.gravity || collider.viscosity) result = this.handleCollideLiquid(player, collider, result);
    return result;
}

PlayerCollider.prototype.handleCollideAction = function(player, collider, result) {
    if (collider.action.x) this.handleCollideActionHorizontal(player, collider, result);
    if (collider.action.y) this.handleCollideActionVertical(player, collider, result);
}

PlayerCollider.prototype.handleCollideActionHorizontal = function(player, collider, result) {
    if (!player.controller.dx) player.controller.dx = player.controller.lastX - collider.x;
    player.controller.x = collider.x + player.controller.dx;
    player.controller.lastX = player.controller.x;
}

PlayerCollider.prototype.handleCollideActionVertical = function(player, collider, result) {
    // todo: check jump
    // todo: check projection
    if (collider.action.y) player.controller.y = collider.y - player.controller.height;
}

PlayerCollider.prototype.handleCollideDamage = function(player, collider, result) {
    player.info.damage(collider.damage);
}

PlayerCollider.prototype.handleCollideLiquid = function(player, collider, result) {
    player.controller.floating = true;
    player.controller.falling = false;
    player.controller.grounded = true;
    player.controller.jumpstartx = player.controller.x;
    player.controller.jumpstarty = player.controller.y;
    player.controller.groundpoint.x = player.controller.x + (player.controller.width / 2);
    player.controller.groundpoint.y = player.controller.y + player.controller.height;
    return result;
}

PlayerCollider.prototype.handleCollideHorizontal = function(player, collider, result) {
    var colh = result.horizontal;
    var dir = colh.direction;
    var amt = colh.amount;
    var buffer = 1;
    amt = amt > buffer ? amt : 0;
    player.controller.groundpoint.x = player.controller.x + (player.controller.width / 2);
    if (dir === "l") {
        player.controller.canMoveLeft = false;
    } else if (dir === "r") {
        player.controller.canMoveRight = false;    
    }
    player.controller.touchWall(dir, amt);
    this.levelcollisions[this.levelcollisions.length] = {
        item : collider,
        x : collider.x,
        y : collider.y,
        width : collider.width,
        height : collider.height,
        ramp : collider.ramp,
        color : "white",
        direction : dir,
        amount : amt
    }
    return result;
}

PlayerCollider.prototype.handleCollideVertical = function(player, collider, result) {
    var colv = result.vertical;
    var dir = colv.direction;
    var amt = colv.amount;
    var buffer = 1;
    amt = amt > buffer ? amt : 0;
    var color = "cyan";
    if (dir === "b") {
        var y = collider.y - player.controller.height;
        
        player.controller.canMoveDown = false;
        player.controller.falling = false;
        
        if (colv.y) {
            player.controller.groundpoint.x = player.controller.x + (player.controller.width / 2);
            player.controller.groundpoint.y = colv.y;

            player.controller.y = colv.y - player.controller.height;

            
            amt = (player.controller.y + player.controller.height) - colv.y;
            
        } else {
            player.controller.groundpoint.x = player.controller.x + (player.controller.width / 2);
            player.controller.groundpoint.y = colv.y - amt;
        }
        
        
        amt = 0;
        
        //player.controller.jumpstarty = player.controller.y - amt;
        player.controller.jumpstartx = player.controller.x;
        player.controller.jumpstarty = player.controller.y;
        
        var cy = result.vertical.y ? result.vertical.y : collider.y; 
        
        player.controller.lastground = {
            x : player.controller.x,
            y : cy,
            width : collider.width,
            height : collider.height,
            ramp : collider.ramp,
            action : collider.action,
            collider : collider, 
            color : color,
            direction : dir,
            amount : amt,
            result : result
        };
        player.controller.touchFloor(amt);
        color = "purple";
    } else if (dir === "t") {
        player.controller.canMoveUp = false;
        player.controller.touchRoof(amt);
        color = "blue";
    }
    this.levelcollisions[this.levelcollisions.length] = {
        item : collider,
        x : collider.x,
        y : collider.y,
        width : collider.width,
        height : collider.height,
        ramp : collider.ramp,
        color : color,
        direction : dir,
        amount : amt
    }
    return result;
}


PlayerCollider.prototype.updateCollisionBox = function() {
    
    var player = this.player;
    
    this.lastbox.x = this.collisionbox.x;
    this.lastbox.y = this.collisionbox.y;
    this.lastbox.width = this.collisionbox.width;
    this.lastbox.height = this.collisionbox.height;
    
    this.collisionbox.x = player.controller.x;
    this.collisionbox.y = player.controller.y;
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
    this.movebox.width = x2 - x1 + player.controller.width;
    this.movebox.height = y2 - y1 + player.controller.height;
    this.movebox.velX = player.controller.velX;
    this.movebox.velY = player.controller.velY;
}

