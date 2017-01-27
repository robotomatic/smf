"use strict";

function PlayerCollider() {
}

PlayerCollider.prototype.collideWith = function(player, collider, result) {
    // todo: only check this if a force has acted on player - movement, hit....?
    if (collider == null) return result;
    result = collide(player, collider, true, result);
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
    var dx = player.dx;
    if (!dx) {
        player.dx = collider.x - player.x;
    }
    var diff = collider.x - dx;
    if (Math.abs(player.velX) < 1) player.x = diff;
    else player.dx = collider.x - player.x;
}

PlayerCollider.prototype.handleCollideActionVertical = function(player, collider, result) {
    // todo: check jump
    if (collider.action.y > 0) player.y = collider.y - player.height;
}

PlayerCollider.prototype.handleCollideDamage = function(player, collider, result) {
    player.damage(collider.damage);
}

PlayerCollider.prototype.handleCollideLiquid = function(player, collider, result) {
    player.floating = true;
    player.environment.gravity = collider.gravity;
    player.environment.viscosity = collider.viscosity;
    player.falling = false;
    player.grounded = true;
    player.jumpstarty = player.y;
    player.groundpoint.x = player.x + (player.width / 2);
    player.groundpoint.y = player.y + player.height;
    return result;
}

PlayerCollider.prototype.handleCollideHorizontal = function(player, collider, result) {
    var colh = result.horizontal;
    var dir = colh.direction;
    var amt = colh.amount;
    var buffer = 1;
    amt = amt > buffer ? amt : 0;
    player.groundpoint.x = player.x + (player.width / 2);
    if (dir === "l") {
        player.canMoveLeft = false;
        if (player.move_left) player.groundpoint.y = player.y + player.height;
    } else if (dir === "r") {
        player.canMoveRight = false;    
        if (player.move_right) player.groundpoint.y = player.y + player.height;
    }
    player.touchWall(dir, amt);
    player.levelcollisions[player.levelcollisions.length] = {
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
        var y = collider.y - player.height;
        if (colv.y) {
            player.groundpoint.x = player.x + (player.width / 2);
            player.groundpoint.y = colv.y;
            if (player.velY >= 0) player.y = player.groundpoint.y - player.height;
        } else {
            player.canMoveDown = false;
            player.groundpoint.x = player.x + (player.width / 2);
            player.groundpoint.y = collider.y - amt;
        }
        player.jumpstarty = player.y - amt;
        player.lastground = {
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
        player.touchFloor(amt);
        color = "purple";
    } else if (dir === "t") {
        player.canMoveUp = false;
        player.touchRoof(amt);
        color = "blue";
    }
    player.levelcollisions[player.levelcollisions.length] = {
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
    if (!player.lastground) return result;
    if (player.jumped  || player.jumping ) return result;
    
    if (player.lastground.ramp) {
        if ((player.lastground.ramp == "right" && player.velX > 0) || (player.lastground.ramp == "left" && player.velX < 0)) return result;

        // player was on a ramp the last time we checked
        // if they're falling now, it might just be that they are going downhill

        var lastr = new Rectangle(player.lastground.x, player.lastground.y, player.lastground.width, player.lastground.height);
        lastr.ramp = player.lastground.ramp;

        var p = getProjectedPoint(player, lastr);
        if (p) {

            var ddd = distance(player.x + player.width / 2, player.y + player.height, p.x, p.y);

            if (ddd < 10){

                player.levelcollisions[player.levelcollisions.length] = {
                    item : lastr,
                    x : player.lastground.x,
                    y : player.lastground.y,
                    width : player.lastground.width,
                    height : player.lastground.height,
                    ramp : player.lastground.ramp,
                    color : "purple",
                    direction : "b",
                    amount : 0
                };

                player.falling = false;
                player.y = p.y - player.height + ddd;
                player.groundpoint.x = p.x;
                player.groundpoint.y = p.y;
                var r = player.lastground.result;
                r.amount = 0;
                return r;
            }
        }
    } else if (player.lastground.action && player.lastground.action.y) {
        
        
        if (player.x < player.lastground.collider.x || player.x > (player.lastground.collider.x + player.lastground.collider.width)) {
            return result;
        }
        
        if (player.lastground.action.y > -1) {
            // on a moving platform going down

            var lastr = new Rectangle(player.lastground.collider.x, player.lastground.collider.y, player.lastground.collider.width, player.lastground.collider.height);
            var p = getProjectedPoint(player, lastr);
            
            if (p) {
                var ddd = distance(player.x + player.width / 2, player.y + player.height, p.x, p.y);
                if (ddd < 100){
                    player.levelcollisions[player.levelcollisions.length] = {
                        item : lastr,
                        x : player.lastground.collider.x,
                        y : player.lastground.collider.y,
                        width : player.lastground.collider.width,
                        height : player.lastground.collider.height,
                        ramp : player.lastground.ramp,
                        color : "cyan",
                        direction : "b",
                        amount : 0
                    };

                    player.falling = false;
                    player.y = player.lastground.collider.y - player.height;
                    player.groundpoint.y = player.lastground.collider.y;
                    player.jumpstarty = player.y;
                    player.touchFloor(0);
                    var r = player.lastground.result;
                    r.amount = 0;
                    return r;
                }
            }
        }
    }

    return result;
}
