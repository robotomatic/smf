"use strict";

function PlayerController(player, x, y, width, height, speed) {

    this.player = player;
    
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.location = new Point(0, 0);

    this.lastX = x;
    this.lastY = y;
    this.dx = 0;
    this.dy = 0;

    this.velX = 0;
    this.velY = 0;
    
    this.acceleration = 1;
    this.speed = speed;
    this.jumpspeed = this.speed * 2.8;
//    this.jumpspeed = this.speed * 1.8;
    
    this.bounce = false;

    this.lookThreshold = 5;
    this.look_left = false;
    this.look_right = false;
    this.look_straight = false;
    this.backwards = false;
    
    this.canMoveUp = true;
    this.canMoveDown = true;
    this.canMoveLeft = true;
    this.canMoveRight = true;

    this.move_left = false;
    this.move_right = false;
    this.lastMoveLeft;
    this.lastMoveRight;
    this.lastDirection;
    
    this.lastground = null;
    this.groundpoint = {
        x : null,
        y : null
    }

    this.jumping = false;
    this.jumped = false;
    this.jumpReleased = true;
    
    this.jumpstart = 0;
    this.jumpend = 0;

    this.jumpmax = 500;
    
    this.doublejumped = false;
    this.falling = true;
    this.floating = false;
    this.grounded = false;
    this.onwall = false;
    this.walltouchside = null;

    this.jumpThreshold = 5;
    this.wallJumpThreshold = this.width * 2;
    this.canDoubleJump = false;
    this.canFly = false;
    
    this.maxjumpheight = 0;
    this.maxjumpdistance = 0;
    this.jumpheight = 0;
    this.jumpdistance = 0;

    this.jumpstartx = null;
    this.jumpstarty = null;
    this.jumpendy = null;
    
    this.idle_timeout = 0;
    this.idle_start = null;
    this.paused = false;

    this.lastwhen = null;
}

PlayerController.prototype.reset = function() {
//    this.canMoveUp = true;
//    this.canMoveDown = true;
//    this.canMoveLeft = true;
//    this.canMoveRight = true;
    this.floating = false;
    this.falling = false;
}

PlayerController.prototype.respawn = function(x, y) {
    this.x = x;
    this.y = y;
    this.groundpoint.x = x + this.width / 2;
    this.groundpoint.y = y + this.height;
    this.jumpstartx = x;
    this.jumpstarty = y;
}


PlayerController.prototype.stop = function() {
    this.move_left = false;
    this.move_right = false;
    this.velX = 0;
    this.velY = 0;
}

PlayerController.prototype.pause = function(p) {
    this.stop();
    this.paused = p;
}


PlayerController.prototype.moveTo = function(where) {
    if (where.x) this.x += where.x;
    if (where.y) this.y += where.y;
}

PlayerController.prototype.lookStop = function() { 
    this.idle_timeout = 0;
    this.idle_start = null;
    this.look_straight = false;
    this.look_left = false;
    this.look_right = false;
}

PlayerController.prototype.lookStraight = function(look) { 
    this.lookStop();
    this.look_straight = look;
};


PlayerController.prototype.turn = function(backwards) { 
    this.backwards = backwards;
};

PlayerController.prototype.left = function(left) { 
    if (!this.player.info.alive  || !this.player.info.ready) return;
    this.lookStop();
    this.move_left = left; 
    this.lastMoveRight = null;
    this.lastDirection = "left";
    if (left) {
        this.lastMoveLeft = timestamp();
    } else {
        if (this.move_right) {
            this.lastMoveLeft = 0;
            this.lastMoveRight = timestamp();
        }
    }
};

PlayerController.prototype.isMovingLeft = function() { return this.move_left; };

PlayerController.prototype.lookLeft = function(look) { 
    this.lookStop();
    this.look_left = look;
};

PlayerController.prototype.isLookingLeft = function(now) { 
    if (!this.lastMoveLeft) return false;
    if (this.look_left) return true;
    if (this.move_left) return true;
    if (this.isFalling && !this.grounded && this.lastDirection == "left") {
        this.lastMoveLeft = now;
        return true;
    }
    var dt = (now - this.lastMoveLeft) / 1000;
    return dt <= this.lookThreshold;
}

PlayerController.prototype.right = function(right) { 
    if (!this.player.info.alive  || !this.player.info.ready) return;
    this.lookStop();
    this.move_right = right; 
    this.lastMoveLeft = null;
    this.lastDirection = "right";
    if (right) {
        this.lastMoveRight = timestamp();
    } else {
        if (this.move_left) {
            this.lastMoveRight = 0;
            this.lastMoveLeft = timestamp();
        }
    }
};

PlayerController.prototype.isMovingRight = function() { return this.move_right; };

PlayerController.prototype.lookRight = function(look) { 
    this.lookStop();
    this.look_right = look;
};

PlayerController.prototype.isLookingRight = function(now) { 
    if (!this.lastMoveRight) return false;
    if (this.look_right) return true;
    if (this.move_right) return true;
    if (this.isFalling && !this.grounded && this.lastDirection == "right") {
        this.lastMoveRight = now;
        return true;
    }
    var dt = (now - this.lastMoveRight) / 1000;
    return dt <= this.lookThreshold;
}

PlayerController.prototype.touchWall = function(side, amount) {
    if (side==="l") this.x += amount;
    else this.x -= amount;
    this.velX = 0;
    this.walltouchside = side;
    this.onwall = true;
};






    
PlayerController.prototype.isOnWall = function() { 
    if (this.grounded) return false;
    if (!this.groundpoint) return false;
    var groundpoint = this.groundpoint;
    if (!this.groundpoint) return false;
    var d = distance(this.x + (this.width / 2), this.y + this.height, groundpoint.x, groundpoint.y);
    if (d <= this.wallJumpThreshold) {
        return true;
    }
    this.onwall = false;
    this.walltouchside = "";
    return false;
}



PlayerController.prototype.touchRoof = function(amount) {
    this.y += amount;
    this.velY *=  (this.velY > 0) ? 1 : -1    
};

PlayerController.prototype.touchFloor = function(amount) {

    if (this.player.info.ready) this.player.info.set = true;
    
    this.y -= amount;

    if (this.bounce) {
        this.velY = -this.velY / 3; 
        if (Math.abs(this.velY) < 1) this.velY = 0;
    } else this.velY = 0;

    
    if (!this.move_left && !this.move_right) this.velX *= .5;
    
    this.groundpoint.x = this.x + (this.width / 2);
    this.groundpoint.y = this.y + this.height;
    
    this.doublejumped = false;
    this.grounded = true;
    this.jumping = false;
    this.falling = false;
    this.onwall = false;
    this.lastDirection = null;
};

PlayerController.prototype.fall = function() {
    this.falling = true;
    this.onwall = false;
    this.lastground = null;
}

PlayerController.prototype.isFalling = function() { return this.falling; }



PlayerController.prototype.canJump = function(physics) {
    if (!this.player.info.alive) return false;
    if (!this.jumped) return false;
    if (this.canFly) return true;
    if (this.jumping) {
        if (!this.canDoubleJump || this.doublejumped) return false;
        if (this.canWallJump(physics)) return true;
    }
    if (!this.groundpoint) return false;
    var groundpoint = this.groundpoint;
    var d = distance(this.x + (this.width / 2), this.y + this.height, groundpoint.x, groundpoint.y);
    return d <= this.jumpThreshold;
};




PlayerController.prototype.canWallJump = function(physics) {
    if (this.canFly) return true;
    return this.isOnWall();
};




PlayerController.prototype.jump = function(jump) {
    
    if (!this.player.info.alive  || !this.player.info.ready) return;
    
    if (jump) {
        this.jumped = (this.jumpReleased) ? true : false;
        this.jumpReleased = false;
        this.jumpstart = timestamp();
    } else {
        this.jumped = jump;
        this.jumpReleased = true;
        this.jumpend = timestamp();
    }
    
};




PlayerController.prototype.doJump = function() {
    this.velY = -this.jumpspeed;
    if (this.isOnWall()) {
        if (this.walltouchside == "l" && this.move_left) this.velX += this.jumpspeed;
        else if (this.walltouchside == "r" && this.move_right) this.velX -= this.jumpspeed;
    }
    this.jumped=false;
    this.jumping = true;
    this.grounded = false;
    this.jumpstartx = this.x;
    this.jumpstarty = this.y;
}

PlayerController.prototype.stopJump = function() {
    this.jumped = false;
    this.jumping = false;
    this.doublejumped = false;
}






PlayerController.prototype.getSpeed = function() {
    return Math.sqrt(Math.abs(this.velX) + Math.abs(this.velY));
}










PlayerController.prototype.idle = function(now) {
    if (!this.isIdle(now)) this.doIdle(now);
    var dt = now - this.idle_start;
    if (this.idle_timeout && dt >= this.idle_timeout) {
        this.lookStop();
        this.doIdle(now);
    }
}

PlayerController.prototype.isIdle = function(now) {
    return (this.look_straight || this.look_left || this.look_right || this.isLookingLeft(now) || this.isLookingRight(now));
}

PlayerController.prototype.doIdle = function(now) {
    var dir = random(0, 2);
    if (dir == 0) this.lookLeft(true);
    else if (dir == 1) this.lookRight(true);
    else this.lookStraight(true);
    this.idle_timeout = random(2000, 3000);
    this.idle_start = now;
}
    
PlayerController.prototype.updateJumpInfo = function(physics) {
    this.updateJumpHeight(physics);
    this.updateJumpDistance(physics);
}

PlayerController.prototype.updateJumpHeight = function(physics) {
    
    var jumpspeed = -this.jumpspeed;
    var jumpspeedsquare = Math.pow(jumpspeed, 2);
    var jumpgravity = 2 * physics.gravity;
    this.maxjumpheight = jumpspeedsquare / jumpgravity;
}

PlayerController.prototype.updateJumpDistance = function(physics) {
}


PlayerController.prototype.getDirection = function(now) {

    var lookLeft = this.isLookingLeft(now);
    var lookRight = this.isLookingRight(now);
    
    if (this.isOnWall()) {
        if (this.walltouchside=="l" && lookLeft) return "right";
        else if (this.walltouchside=="r" && lookRight) return "left";
    }
    
    if (lookLeft) return (this.backwards) ? "right" : "left";
    if (lookRight) return  (this.backwards) ? "left" : "right";
    return "front";
}

PlayerController.prototype.getState = function(now, dir) {
    var state = "";
    if (!this.player.info.alive) state = "dead";
    else if (this.falling && this.velY > 0) state = "fall";
    else if (this.falling && this.velY < 0) state = "jump";
    else if (this.jumping) state = "jump";
    else if ((this.canMoveLeft && this.isMovingLeft()) || (this.canMoveRight && this.isMovingRight())) state = "walk";
    else state = "idle";
    return state;
}






PlayerController.prototype.update = function(now, delta, physics) {
    var canjump = this.canJump(physics);
    if (this.jumped && this.falling && !canjump && !this.canWallJump(physics) && !this.canDoubleJump) this.stopJump();
//    else if (this.jumped && (canjump || this.canWallJump(physics))) this.doJump();
    else if (this.jumped && (canjump || this.canWallJump(physics))) this.doJump();
    this.applyPhysics(now, delta, physics);
    this.updateLocation(now,delta,  physics);
    this.updateJumpInfo(physics);
}




PlayerController.prototype.applyPhysics = function(now, delta, physics) {
    if (this.velX > 0) {
        this.velX -= (this.falling) ? physics.airfriction : physics.friction;
        if (this.velX < 0) this.velX = 0;
    } else if (this.velX < 0) {
        this.velX += (this.falling) ? physics.airfriction : physics.friction;
        if (this.velX > 0) this.velX = 0;
    }
    if (this.floating) {
        // todo: get physics properties of collider
        /*
        var g = Number(this.environment.gravity);
        var v = Number(this.environment.viscosity);
        this.velX *=  v;
        if (this.velY > 0) this.velY *= v;
        else if (this.velY < 0) this.velY *= g;
        */
    }
    if (this.canMoveDown)  {
        this.velY += physics.gravity;        
        if (this.isOnWall() && this.falling && this.velY > 0) {
            if ((!this.walltouchside) ||
                ((this.walltouchside == "l") && !this.move_left) ||
                ((this.walltouchside == "r") && !this.move_right)) return;
            this.velY -= physics.wallfriction;
        }
    }
};

PlayerController.prototype.updateLocation = function(now, delta, physics) {
    if (!this.player.info.ready) return;
    
    var acceleration = this.acceleration;
    var speed = this.speed;

    if (this.move_left && this.move_right) {
        if (this.lastMoveRight < this.lastMoveLeft) {
            if (this.velX < speed) this.velX += acceleration;
        } else {
            if (this.velX > -speed) this.velX -= acceleration;
        }
    } else if (this.move_left) {
        if (this.velX > -speed) this.velX -= acceleration;
    }else if (this.move_right) {
        if (this.velX < speed) this.velX += acceleration;
    }
    
    
    if (this.velX < -speed) this.velX = -speed;
    else if (this.velX > speed) this.velX = speed;

    var jumpspeed = this.jumpspeed;
    var terminalVelocity = physics.terminalVelocity;
    
    if (this.jumping) {
        if (this.jumpReleased && this.jumpstart && this.jumpend) {
            if (this.velY < 0) {
                var jumptime = this.jumpend - this.jumpstart;
                if (jumptime > this.jumpmax) jumptime = this.jumpmax;
                var jumpdelta = round(jumptime / this.jumpmax);
                this.velY *= jumpdelta;
                this.jumpstart = 0;
                this.jumpend = 0;
            }
        }
    }
    
    
    if (this.velY < -jumpspeed) this.velY = -jumpspeed;
    if (this.velY > terminalVelocity) this.velY = terminalVelocity;
    
    this.velX = round(this.velX);
    this.velY = round(this.velY);
    
    var dx = this.velX * delta;
    var dy = this.velY * delta;
    
    this.x += dx;
    this.y += dy;
    
    this.x = round(this.x);
    this.y = round(this.y);
    
    if (this.grounded) {
        this.groundpoint.x = this.x + (this.width / 2);    
        this.groundpoint.y = this.y + (this.height);    
        this.groundpoint.x = round(this.groundpoint.x);
        this.groundpoint.y = round(this.groundpoint.y);
    }
    this.lastwhen = now;
};

PlayerController.prototype.getLocation = function() {
    
    // todo: jank
    this.location.x = this.lastX;
    this.location.y = this.lastY;
    return this.location;
}



PlayerController.prototype.smooth = function(now, scale) {
    
    var px = this.x;
    if (!this.lastX) this.lastX = px;
    var dx = (px - this.lastX) / 2;
    if (dx < 0 && this.canMoveLeft || dx > 0 && this.canMoveRight) {
        px = px - dx;    
    }
    this.lastX = px;

    if (!this.lastY) this.lastY = py;
    var py = this.y;
    var dy = (py - this.lastY) / 2;
    if (dy < 0 && this.canMoveUp || dy > 0 && this.canMoveDown) {
        py = py - dy;
    }
    this.lastY = py;
}

