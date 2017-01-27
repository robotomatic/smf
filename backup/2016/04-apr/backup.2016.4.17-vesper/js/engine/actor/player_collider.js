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
        color: "purple",
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
    result = collide(player.controller, collider, true, result);
    if (result.collided()) return this.handleCollide(player, collider, result);
    else return this.handleNoCollide(player, collider, result);
};

PlayerCollider.prototype.handleCollide = function(player, collider, result) {
    if (collider.damage) this.handleCollideDamage(player, collider, result);
    if (collider.action) this.handleCollideAction(player, collider, result);
    if (collider.gravity || collider.viscosity) return this.handleCollideLiquid(player, collider, result);
    if (result.horizontal.amount) return this.handleCollideHorizontal(player, collider, result);
    else if (result.vertical.amount) return this.handleCollideVertical(player, collider, result);
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
        color : "magenta",
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
        if (colv.y) {
            player.controller.groundpoint.x = player.controller.x + (player.controller.width / 2);
            player.controller.groundpoint.y = colv.y;
            player.controller.y = collider.y - player.controller.height;
        } else {
            player.controller.groundpoint.x = player.controller.x + (player.controller.width / 2);
            player.controller.groundpoint.y = collider.y - amt;
        }
        player.controller.jumpstarty = player.controller.y - amt;
        player.controller.lastground = {
            x : collider.x,
            y : collider.y,
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

PlayerCollider.prototype.handleNoCollide = function(player, collider, result) {
    if (!player.controller.lastground) return result;
    if (player.controller.jumped  || player.controller.jumping ) return result;
    
    if (player.controller.lastground.ramp) {
        if ((player.controller.lastground.ramp == "right" && player.controller.velX > 0) || (player.controller.lastground.ramp == "left" && player.controller.velX < 0)) return result;

        // player was on a ramp the last time we checked
        // if they're falling now, it might just be that they are going downhill

        var lastr = new Rectangle(player.controller.lastground.x, player.controller.lastground.y, player.controller.lastground.width, player.controller.lastground.height);
        lastr.ramp = player.controller.lastground.ramp;

        var p = getProjectedPoint(player, lastr);
        if (p) {

            var ddd = distance(player.controller.x + player.controller.width / 2, player.controller.y + player.controller.height, p.x, p.y);

            if (ddd < 10){

                this.levelcollisions[this.levelcollisions.length] = {
                    item : lastr,
                    x : player.controller.lastground.x,
                    y : player.controller.lastground.y,
                    width : player.controller.lastground.width,
                    height : player.controller.lastground.height,
                    ramp : player.controller.lastground.ramp,
                    color : "purple",
                    direction : "b",
                    amount : 0
                };

                player.controller.falling = false;
                player.controller.y = p.y - player.controller.height + ddd;
                player.controller.groundpoint.x = p.x;
                player.controller.groundpoint.y = p.y;
                var r = player.controller.lastground.result;
                r.amount = 0;
                return r;
            }
        }
    } else if (player.controller.lastground.action && player.controller.lastground.action.y) {
        
        
        if (player.controller.x < player.controller.lastground.collider.x || player.controller.x > (player.controller.lastground.collider.x + player.controller.lastground.collider.width)) {
            return result;
        }
        
//        if (player.controller.lastground.action.y > -1) {
            // on a moving platform going down

            var lastr = new Rectangle(player.controller.lastground.collider.x, player.controller.lastground.collider.y, player.controller.lastground.collider.width, player.controller.lastground.collider.height);
            var p = getProjectedPoint(player, lastr);

            if (p) {
                var ddd = distance(player.controller.x + player.controller.width / 2, player.controller.y + player.controller.height, p.x, p.y);
                if (ddd < 100){
                    this.levelcollisions[this.levelcollisions.length] = {
                        item : lastr,
                        x : player.controller.lastground.collider.x,
                        y : player.controller.lastground.collider.y,
                        width : player.controller.lastground.collider.width,
                        height : player.controller.lastground.collider.height,
                        ramp : player.controller.lastground.ramp,
                        color : "cyan",
                        direction : "b",
                        amount : 0
                    };

                    player.controller.falling = false;
                    player.controller.y = player.controller.lastground.collider.y - player.controller.height;
                    player.controller.groundpoint.y = player.controller.lastground.collider.y;
                    player.controller.jumpstarty = player.controller.y;
                    player.controller.touchFloor(0);
                    var r = player.controller.lastground.result;
                    r.amount = 0;
                    return r;
                }
            }
//        }
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

