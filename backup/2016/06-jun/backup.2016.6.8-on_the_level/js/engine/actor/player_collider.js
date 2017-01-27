"use strict";

function PlayerCollider(player) {
    this.colliders = new Array();
    this.colliders["horizontal"] = {
        color: "orange",
        x : player.controller.x,
        y : player.controller.y,
        width : player.controller.width,
        height : player.controller.height / 1.5
    };
    this.colliders["vertical"] = {
        color: "yellow",
        x : player.controller.x,
        y : player.controller.y,
        width : player.controller.width,
        height : player.controller.height
    };
    this.collisionbox = {
        x : 0, 
        y : 0, 
        width : 0, 
        height : 0
    }
    this.levelcollisions = new Array();
}

PlayerCollider.prototype.collideWith = function(player, collider, result) {
    if (collider == null) return result;
    
    // todo: need to split collide into collide Y and collide X. 
    // handle Y result before testing X
    
    result = collide(player.controller, collider, true, result);
    if (result.collided()) return this.handleCollide(player, collider, result);
    else {
        if (!result.vertical.amount) {
            if (player.controller.lastground) {
                var ph = player.controller.y + player.controller.height;
                var d = player.controller.lastground.y - ph;
                if (Math.abs(d) < 2) {
                    player.controller.falling = false;
                    
                } else {
                    player.controller.falling = true;
                }
            } else {
                player.controller.falling = true;
            }
        }
        return result;
    }
};

PlayerCollider.prototype.handleCollide = function(player, collider, result) {
    if (collider.damage) this.handleCollideDamage(player, collider, result);
    if (collider.action) this.handleCollideAction(player, collider, result);
    if (collider.gravity || collider.viscosity) return this.handleCollideLiquid(player, collider, result);
    if (result.vertical.amount) return this.handleCollideVertical(player, collider, result);
    else if (result.horizontal.amount) return this.handleCollideHorizontal(player, collider, result);
    else return result;
}

PlayerCollider.prototype.handleCollideAction = function(player, collider, result) {
    if (collider.action.x) this.handleCollideActionHorizontal(player, collider, result);
    if (collider.action.y) this.handleCollideActionVertical(player, collider, result);
}

PlayerCollider.prototype.handleCollideActionHorizontal = function(player, collider, result) {
    var dx = player.controller.dx;
    if (!dx) {
        player.controller.dx = collider.x - player.controller.x;
    }
    var diff = collider.x - dx;
    if (Math.abs(player.controller.velX) < 1) player.controller.x = diff;
    else player.controller.dx = collider.x - player.controller.x;
}

PlayerCollider.prototype.handleCollideActionVertical = function(player, collider, result) {
    // todo: check jump
    if (collider.action.y > 0) player.controller.y = collider.y - player.controller.height;
}

PlayerCollider.prototype.handleCollideDamage = function(player, collider, result) {
    player.info.damage(collider.damage);
}

PlayerCollider.prototype.handleCollideLiquid = function(player, collider, result) {
    player.controller.floating = true;
    player.controller.falling = false;
    player.controller.grounded = true;
    player.controller.jumpstarty = player.y;
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
        } else {
            player.controller.groundpoint.x = player.controller.x + (player.controller.width / 2);
            player.controller.groundpoint.y = colv.y - amt;
        }
        player.controller.jumpstarty = player.controller.y - amt;
        
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


PlayerCollider.prototype.updateCollisionBox = function(player) {
    
    this.colliders["horizontal"].x = player.controller.x;
    this.colliders["horizontal"].y = player.controller.y;
   
    this.colliders["vertical"].x = player.controller.x;
    this.colliders["vertical"].y = player.controller.y;
 
    var left = player.controller.velX < 0;
    var right = player.controller.velX > 0;
    
    var top = this.colliders["vertical"].y < player.controller.y;
    
    var minx = left ? this.colliders["horizontal"].x : player.controller.x;
    var miny = top ? this.colliders["vertical"].y : player.controller.y;
    
    var maxx = right ? this.colliders["horizontal"].x + this.colliders["horizontal"].width : player.controller.x + player.controller.width;
    var maxy = top ? player.controller.y + player.controller.height : this.colliders["vertical"].y + this.colliders["vertical"].height;
    
    var width = maxx - minx;
    var height = maxy - miny;
    
    this.collisionbox.x = minx;
    this.collisionbox.y = miny;
    this.collisionbox.width = width;
    this.collisionbox.height = height;
}

