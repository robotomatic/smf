"use strict";

function Player(id, name, color, x, y, width, height, speed, character, hp, listener) {

    this.debug = false;
    this.outline = true;
    
    this.id = id;

    this.ready = false;
    this.set = false;
    
    this.name = name;
    this.color = color;
    
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.dx = 0;
    this.dy = 0;
    
    this.lastX = x;
    this.lastY = y;
    
    this.bounce = false;

    
    this.acceleration = 1;
    
    this.speed = speed;
    this.jumpspeed = this.speed * 2;
    
    this.character = character;
    
    this.maxhp = hp;
    this.hp = hp;
    this.lastdamage = null;
    this.damagedthreshold = 2;
    this.alive = true;
    
    this.velX = 0;
    this.velY = 0;
    
    this.canMoveUp = true;
    this.canMoveDown = true;
    this.canMoveLeft = true;
    this.canMoveRight = true;
    
    this.look_left = false;
    this.look_right = false;
    this.look_straight = false;
    
    this.move_left = false;
    this.move_right = false;
    this.lastMoveLeft;
    this.lastMoveRight;
    this.lastDirection;
    
    this.lookThreshold = 5;
    
    this.jumping = false;
    this.jumped = false;
    this.jumpReleased = true;
    this.jumpThreshold = 5;
    
    this.wallJumpThreshold = this.width * 2;
    this.canDoubleJump = false;
    this.doublejumped = false;
    
    this.canFly = false;
    
    this.grounded = false;
    
    this.onwall = false;
    this.walltouchside = null;
    
    this.falling = true;
    
    // todo: set jump distance and plot jump landing
    this.maxjumpheight = 0;
    this.maxjumpdistance = 0;
    this.jumpheight = 0;
    this.jumpdistance = 0;

    this.jumpstarty = null;
    this.jumpendy = null;
    
    this.camerabox = new Rectangle(this.x, this.y, this.width, this.height);
    this.cameray = 0;

    this.collisionpad = 10;

    this.collider = new PlayerCollider();
    
    this.colliders = new Array();
    this.colliders["horizontal"] = {
        color: "orange",
        x : this.x,
        y : this.y,
        width : this.width,
        height : this.height / 1.5
    };
    this.colliders["vertical"] = {
        color: "purple",
//        x : this.x + (this.collisionpad / 2),
        x : this.x,
        y : this.y,
//        width : this.width - (this.collisionpad),
        width : this.width,
        height : this.height
    };

    this.collisionbox = {
        x : 0, 
        y : 0, 
        width : 0, 
        height : 0
    }

    this.lastground = null;
    
    this.levelcollisions = new Array();
    
    this.groundpoint = {
        x : null,
        y : null
    }

    
    this.floating = false;
    this.environment  = {
        gravity : 1,
        viscosity : 1
    }
    
    if (listener) this.listener = listener;
    
    this.paused = false;
    
    this.idle_timeout = 0;
    this.idle_start = null;

    this.lastwhen = null;
}

Player.prototype.timeout = function(arg, val, t) { 

    // todo: check elapsed time on update() instead
    
    
    var p = this;
    setTimeout(function() {
        p[arg](val);
    }, t);
}

Player.prototype.loadJson = function(json) { 
    for (var key in json) this[key]= json[key]; 
    return this;
};

Player.prototype.setCharacter = function(character) { 
    this.character = character; 
}

Player.prototype.respawn = function(x, y) {
    this.ready = false;
    this.set = false;
    this.x = x;
    this.y = y;
    this.groundpoint.x = x + this.width / 2;
    this.groundpoint.y = y + this.height;
    this.jumpstarty = y;
}

Player.prototype.reset = function() {
    this.alive = true;
    this.ready = true;
    this.hp = this.maxhp;
}

Player.prototype.stop = function() {
    this.move_left = false;
    this.move_right = false;
    this.velX = 0;
    this.velY = 0;
}

Player.prototype.pause = function(p) {
    this.stop();
    this.paused = p;
}

Player.prototype.damage = function(amount) {
    this.lastdamage = timestamp();
    this.hp -= amount;
    if (this.hp <= 0) this.die();
}

Player.prototype.die = function() {
    var alive = this.alive;
    this.alive = false;
    this.lastdamage = null;
    if (alive && this.listener) this.listener.playerDied(this);
}

Player.prototype.isDamaged = function() {
    if (!this.alive || !this.ready) return false;
    if (!this.lastdamage) return false;
    var now = timestamp();
    var dt = (now - this.lastdamage) / 1000;
    return dt <= this.damagedthreshold;
}

Player.prototype.moveTo = function(where) {
    if (where.x) this.x += where.x;
    if (where.y) this.y += where.y;
}

Player.prototype.lookStop = function() { 
    this.idle_timeout = 0;
    this.idle_start = null;
    this.look_straight = false;
    this.look_left = false;
    this.look_right = false;
}

Player.prototype.lookStraight = function(look) { 
    this.lookStop();
    this.look_straight = look;
};

Player.prototype.left = function(left) { 
    
    if (!this.alive  || !this.ready) return;

    this.lookStop();
    
    this.move_left = left; 
//    this.move_right = false;
    this.lastMoveRight = null;
    this.lastDirection = "left";
    if (left) this.lastMoveLeft = timestamp();
};

Player.prototype.isMovingLeft = function() { return this.move_left; };

Player.prototype.lookLeft = function(look) { 
    this.lookStop();
    this.look_left = look;
};

Player.prototype.isLookingLeft = function(now) { 
    if (this.look_left) return true;
    if (this.move_left) return true;
    if (this.isFalling && !this.grounded && this.lastDirection == "left") {
        this.lastMoveLeft = now;
        return true;
    }
    var dt = (now - this.lastMoveLeft) / 1000;
    return dt <= this.lookThreshold;
}

Player.prototype.right = function(right) { 
    
    if (!this.alive  || !this.ready) return;

    this.lookStop();
    
    this.move_right = right; 
//    this.move_left = false;
    this.lastMoveLeft = null;
    this.lastDirection = "right";
    if (right) this.lastMoveRight = timestamp();
};

Player.prototype.isMovingRight = function() { return this.move_right; };

Player.prototype.lookRight = function(look) { 
    this.lookStop();
    this.look_right = look;
};

Player.prototype.isLookingRight = function(now) { 
    if (this.look_right) return true;
    if (this.move_right) return true;
    if (this.isFalling && !this.grounded && this.lastDirection == "right") {
        this.lastMoveRight = now;
        return true;
    }
    var dt = (now - this.lastMoveRight) / 1000;
    return dt <= this.lookThreshold;
}

Player.prototype.touchWall = function(side, amount) {
    if (side==="l") this.x += amount;
    else this.x -= amount;
    this.velX = 0;
    this.walltouchside = side;
    this.onwall = true;
};






Player.prototype.isOnGround = function() { 
    if (!this.groundpoint) return false;
    return (this.groundpoint.y - (this.y + this.height) < this.jumpThreshold);
}
    
Player.prototype.isOnWall = function() { 
    if (this.grounded) return false;
    if (!this.groundpoint) return false;
    var groundpoint = this.getGroundPoint();
    if (this.isOnGround()) return false;
    var d = distance(this.x + (this.width / 2), this.y + this.height, groundpoint.x, groundpoint.y);
    if (d <= this.wallJumpThreshold) {
        return true;
    }
    this.onwall = false;
    this.walltouchside = "";
    return false;
}



Player.prototype.touchRoof = function(amount) {
    this.y += amount;
    this.velY *=  (this.velY > 0) ? 1 : -1    
};

Player.prototype.touchFloor = function(amount) {

    if (this.ready) this.set = true;
    
    this.y -= amount;

    if (this.bounce) {
        this.velY = -this.velY / 3; 
        if (Math.abs(this.velY) < 1) this.velY = 0;
    } else this.velY = 0;

    
    if (!this.move_left && !this.move_right) this.velX *= .5;
    
//    this.groundpoint.x = this.x + (this.width / 2);
//    this.groundpoint.y = this.y + this.height;
    
    this.doublejumped = false;
    this.grounded = true;
    this.jumping = false;
    this.falling = false;
    this.onwall = false;
    this.lastDirection = null;
};

Player.prototype.fall = function() {
    this.falling = true;
    this.onwall = false;
    this.lastground = null;
}
Player.prototype.isFalling = function() { return this.falling; }



Player.prototype.canJump = function(physics) {
    if (!this.alive) return false;
    if (!this.jumped) return false;
    if (this.canFly) return true;
    if (this.jumping) {
        if (!this.canDoubleJump || this.doublejumped) return false;
        if (this.canWallJump(physics)) return true;
    }
    if (!this.groundpoint) return false;
    if (!this.isOnGround()) return false;
    var groundpoint = this.getGroundPoint();
    var d = distance(this.x + (this.width / 2), this.y + this.height, groundpoint.x, groundpoint.y);
    return d <= this.jumpThreshold;
};




Player.prototype.canWallJump = function(physics) {
    if (this.canFly) return true;
    return this.isOnWall();
};




Player.prototype.jump = function(jump) {
    
    if (!this.alive  || !this.ready) return;
    
    if (jump) {
        this.jumped = (this.jumpReleased) ? true : false;
        this.jumpReleased = false;
    } else {
        this.jumped = jump;
        this.jumpReleased = true;
    }
};




Player.prototype.doJump = function() {
    this.velY = -this.jumpspeed;
    if (this.isOnWall()) {
        if (this.walltouchside == "l" && this.move_left) this.velX += this.jumpspeed;
        else if (this.walltouchside == "r" && this.move_right) this.velX -= this.jumpspeed;
    }
    this.jumped=false;
    this.jumping = true;
    this.grounded = false;
    this.jumpstarty = this.y;
}

Player.prototype.stopJump = function() {
    this.jumped = false;
    this.jumping = false;
    this.doublejumped = false;
}






Player.prototype.getSpeed = function() {
    return Math.sqrt(Math.abs(this.velX) + Math.abs(this.velY));
}






Player.prototype.update = function(now, physics) {
    
    if (this.levelcollisions.length == 0) this.fall();
    
    var canjump = this.canJump(physics);
    if (this.jumped && this.falling && !canjump && !this.canWallJump(physics) && !this.canDoubleJump) this.stopJump();
    else if (this.jumped && (canjump || this.canWallJump(physics))) this.doJump();
    
    this.applyPhysics(now, physics);
    this.updateLocation(now, physics);
    this.updateCollisionBox();
    this.updateJumpInfo(physics);
    this.updateCameraBox();
}

Player.prototype.applyPhysics = function(now, physics) {

    if (this.velX > 0) {
        this.velX -= (this.falling) ? physics.airfriction : physics.friction;
        if (this.velX < 0) this.velX = 0;
    } else if (this.velX < 0) {
        this.velX += (this.falling) ? physics.airfriction : physics.friction;
        if (this.velX > 0) this.velX = 0;
    }

    if (this.floating) {
        var g = Number(this.environment.gravity);
        var v = Number(this.environment.viscosity);
        this.velX *=  v;
        if (this.velY > 0) this.velY *= v;
        else if (this.velY < 0) this.velY *= g;
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

Player.prototype.updateLocation = function(now, physics) {

    if (!this.ready) return;
    
    var acceleration = this.acceleration;
    var speed = this.speed;
    var jumpspeed = this.jumpspeed;
    
    var terminalVelocity = physics.terminalVelocity;

    if (this.move_left) this.velX = -speed;
    else if (this.move_right) this.velX = speed;

    if (this.velY < -jumpspeed) this.velY = -jumpspeed;
    if (this.velY > terminalVelocity) this.velY = terminalVelocity;
    
    this.velX = (Math.abs(this.velX) < 0) ? 0 : round(this.velX);
    this.velY = (Math.abs(this.velY) < 0) ? 0 : round(this.velY);
    
    var dx = this.velX;
    var dy = this.velY;
    
    this.x = round(this.x + dx);
    this.y = round(this.y + dy);
    
    if (this.grounded) {
        this.groundpoint.x = round(this.x + (this.width / 2));    
        this.groundpoint.y = round(this.y + (this.height));    
    }
    
    this.lastwhen = now;
};
























Player.prototype.getDirection = function(now) {

    var lookLeft = this.isLookingLeft(now);
    var lookRight = this.isLookingRight(now);

    if (this.isOnWall()) {
        if (this.walltouchside=="l" && lookLeft) return "right";
        else if (this.walltouchside=="r" && lookRight) return "left";
    }

    if (lookLeft) return "left";
    else if (lookRight) return "right";
    else return "front";
}

Player.prototype.getState = function(now, dir) {
    var state = "";
    if (!this.alive) state = "dead";
    else if (this.falling && this.velY > 0) state = "fall";
    else if (this.falling && this.velY < 0) state = "jump";
    else if (this.jumping) state = "jump";
    else if ((this.canMoveLeft && this.isMovingLeft()) || (this.canMoveRight && this.isMovingRight())) state = "walk";
    else state = "idle";
    return state;
}

Player.prototype.translate = function(dx, dy) {
    if (this.character) this.character.translate(dx, dy, this.lastX - this.x, this.lastY - this.y);    
}
    









    
Player.prototype.idle = function(now) {
    if (!this.isIdle(now)) this.doIdle(now);
    var dt = now - this.idle_start;
    if (this.idle_timeout && dt >= this.idle_timeout) {
        this.lookStop();
        this.doIdle(now);
    }
}

Player.prototype.isIdle = function(now) {
    return (this.look_straight || this.look_left || this.look_right || this.isLookingLeft(now) || this.isLookingRight(now));
}

Player.prototype.doIdle = function(now) {
    var dir = random(0, 2);
    if (dir == 0) this.lookLeft(true);
    else if (dir == 1) this.lookRight(true);
    else this.lookStraight(true);
    this.idle_timeout = random(2000, 3000);
    this.idle_start = now;
}
    
Player.prototype.updateJumpInfo = function(physics) {
    this.updateJumpHeight(physics);
    this.updateJumpDistance(physics);
}

Player.prototype.updateJumpHeight = function(physics) {
    var jumpspeed = -this.jumpspeed;
    var jumpspeedsquare = Math.pow(jumpspeed, 2);
    var jumpgravity = 2 * physics.gravity;
    this.maxjumpheight = jumpspeedsquare / jumpgravity;
}

Player.prototype.updateJumpDistance = function(physics) {
}

Player.prototype.resetLevelCollisions = function() {
    this.canMoveUp = true;
    this.canMoveDown = true;
    this.canMoveLeft = true;
    this.canMoveRight = true;
    this.floating = false;
    this.environment.gravity = 1;
    this.environment.viscosity = 1;
    this.levelcollisions.length = 0;
}

Player.prototype.collideWith = function(collider, result) {
    return this.collider.collideWith(this, collider, result);
};

    
    
Player.prototype.getGroundPoint = function() {
    return this.groundpoint;
}

Player.prototype.updateCameraBox = function() {
    var camx = this.x;
    var camwidth = this.width;
    if (isNaN(this.maxjumpheight)) this.maxjumpheight = 1;
    var camheight = this.maxjumpheight + this.height;
    if (camheight < this.height || isNaN(camheight)) camheight = this.height;
//    var camy = this.groundpoint.y - camheight;
    var camy = this.y + this.height - camheight;
    var jp = this.jumpstarty;
    var dy = jp - this.y;
    camy += dy;
    var dj = this.y - jp;
    if (dj > 5) camy += dj; 
    this.camerabox.x = camx;
    this.camerabox.y = camy;
    this.camerabox.width = camwidth;
    this.camerabox.height = camheight;
}

Player.prototype.updateCollisionBox = function() {
    
//    this.colliders["horizontal"].x = (this.x - this.collisionpad) + this.velX;
    this.colliders["horizontal"].x = this.x; // - (this.collisionpad / 2);
    this.colliders["horizontal"].y = this.y;
   
//    this.colliders["vertical"].x = this.x + (this.collisionpad / 2);
    this.colliders["vertical"].x = this.x;
//    this.colliders["vertical"].y = this.y + this.velY + this.collisionpad;
//    this.colliders["vertical"].y = this.y + this.collisionpad;
    this.colliders["vertical"].y = this.y;
 
    var left = this.velX < 0;
    var right = this.velX > 0;
    
    var top = this.colliders["vertical"].y < this.y;
    
    var minx = left ? this.colliders["horizontal"].x : this.x - this.collisionpad;
    var miny = top ? this.colliders["vertical"].y : this.y;
    
    var maxx = right ? this.colliders["horizontal"].x + this.colliders["horizontal"].width : this.x + this.width + this.collisionpad;
    var maxy = top ? this.y + this.height : this.colliders["vertical"].y + this.colliders["vertical"].height;
    
    var width = maxx - minx;
    var height = maxy - miny;
    
    this.collisionbox.x = minx;
    this.collisionbox.y = miny;
    this.collisionbox.width = width;
//    this.collisionbox.height = height + this.collisionpad;
    this.collisionbox.height = height;
}




































Player.prototype.draw = function(now, ctx, x, y, width, height, quality) {
    
    var dir = this.getDirection(now);
    var state = this.getState(now, dir);
    if (state == "idle") this.idle(now);
    
    if (this.character) this.character.draw(now, ctx, this.color, x, y, width, height, dir, state, this.outline, this.debug, quality);
    else {
        ctx.fillStyle = this.color;
        drawShape(ctx, x, y, width, height);
    }
    
    if (this.debug) this.drawDebug(now, ctx, x, y, width, height);
    
}




Player.prototype.drawDebug = function(now, ctx, x, y, width, height) {

    var scale = width / this.width;
    
//    var cx = (this.collisionbox.x - this.x) * scale;
//    var cy = (this.collisionbox.y - this.y) * scale;
//    this.drawDebugRect(ctx, x + cx, y + cy, scale, this.collisionbox, "yellow");
//    
    var hx = (this.colliders["horizontal"].x - this.x) * scale;
    var hy = (this.colliders["horizontal"].y - this.y) * scale;
    this.drawDebugRect(ctx, x + hx, y + hy, scale, this.colliders["horizontal"], this.colliders["horizontal"].color);
    
    var vx = (this.colliders["vertical"].x - this.x) * scale;
    var vy = (this.colliders["vertical"].y - this.y) * scale;
    this.drawDebugRect(ctx, x + vx, y + vy, scale, this.colliders["vertical"], this.colliders["vertical"].color);

    var cbx = (this.camerabox.x - this.x) * scale;
    var cby = (this.camerabox.y - this.y) * scale;
    this.drawDebugRect(ctx, x + cbx, y + cby, scale, this.camerabox, "cyan");
    
//    for (var i = 0; i < this.levelcollisions.length; i++) this.drawDebugItem(ctx, x, y, scale, this.levelcollisions[i]);
    
    var gpx = (this.groundpoint.x - this.x) * scale;
    var gpy = (this.groundpoint.y - this.y) * scale;
    var gr = new Rectangle(x + gpx - 2, y + gpy - 4, 4, 8);
    ctx.fillStyle = "white";
    gr.draw(ctx);
    
    this.drawDebugText(ctx, x, y, width, height, scale);
}

Player.prototype.drawDebugText = function(ctx, x, y, width, height, scale) {
    
    var pad = 5 * scale;

    var message = "x:" + this.x + "\ny: " + this.y;
    
    message += "\nvx:" + this.velX + "\nvy: " + this.velY;
    
    drawText(ctx, message, "red", x + width + pad, y + pad);
    
}


Player.prototype.drawDebugRect = function(ctx, x, y, scale, rect, color) {
    drawShapeOutline(ctx, color, rect, x, y, rect.width * scale, rect.height * scale, 1, 1, scale);
}

Player.prototype.drawDebugItem = function(ctx, x, y, scale, item) {

    var ix = (item.x - this.x) * scale;
    var iy = (item.y - this.y) * scale;
    
    var color = item.color;
    
    drawShapeOutline(ctx, color, item, x + ix, y + iy, item.width * scale, item.height * scale, 1, 1, scale);
}