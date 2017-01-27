"use strict";

function Player(id, name, color, x, y, width, height, speed, character, hp, listener) {

    this.debug = false;
    
    this.id = id;

    this.ready = false;
    this.set = false;
    
    this.name = name;
    this.color = color;
    
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.bounce = false;

    this.speed = speed;
    this.jumpspeed = speed;
//    this.jumpspeed = 2;
    
    this.character = character;
    
    this.maxhp = hp;
    this.hp = hp;
    this.lastdamage = null;
    this.damagedthreshold = 2;
    this.alive = true;
    
    this.velX = 0;
    this.velY = 0;
    
    this.acceleration = 1;
    
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
    this.jumpThreshold = this.height / 2;
    
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
    
    this.colliders = new Array();

    this.colliders["horizontal"] = {
        color: "orange",
        x : this.x - this.collisionpad / 2,
        y : this.y,
        width : this.width + (this.collisionpad),
        height : this.height / 1.5
    };
    
    this.colliders["vertical"] = {
        color: "orange",
        x : this.x + (this.collisionpad / 4),
        y : this.y,
        width : this.width - (this.collisionpad / 2),
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
    
}

Player.prototype.timeout = function(arg, val, t) { 

    // todo: check elapsed time on update() instead
    
    
    let p = this;
    setTimeout(function() {
        p[arg](val);
    }, t);
}

Player.prototype.loadJson = function(json) { 
    for (let key in json) this[key]= json[key]; 
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
    let alive = this.alive;
    this.alive = false;
    this.lastdamage = null;
    if (alive && this.listener) this.listener.playerDied(this);
}

Player.prototype.isDamaged = function() {
    if (!this.alive || !this.ready) return false;
    if (!this.lastdamage) return false;
    let now = timestamp();
    let dt = (now - this.lastdamage) / 1000;
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
    let dt = (now - this.lastMoveLeft) / 1000;
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
    let dt = (now - this.lastMoveRight) / 1000;
    return dt <= this.lookThreshold;
}

Player.prototype.touchWall = function(side, amount) {
    if (side==="l") this.x += amount;
    else this.x -= amount;
    this.velX = 0;
    this.walltouchside = side;
    this.onwall = true;
};

Player.prototype.isOnWall = function() { 
    if (this.grounded) return false;
    if (!this.groundpoint) return false;
    let groundpoint = this.getGroundPoint();
    let d = distance(this.x + (this.width / 2), this.y + this.height, groundpoint.x, groundpoint.y);
    if (d <= this.wallJumpThreshold) {
        return true;
    }
    this.onwall = false;
    this.walltouchside = "";
    return false;
}

Player.prototype.canWallJump = function(physics) {
    if (this.canFly) return true;
    return this.isOnWall();
};

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
}
Player.prototype.isFalling = function() { return this.falling; }

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
    this.velY = -this.jumpspeed * 2;
    if (this.isOnWall()) {
        if (this.walltouchside == "l" && this.move_left) this.velX += this.jumpspeed * 3;
        else if (this.walltouchside == "r" && this.move_right) this.velX -= this.jumpspeed * 3;
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

Player.prototype.canJump = function(physics) {
    if (!this.alive) return false;
    if (!this.jumped) return false;
    if (this.canFly) return true;
    if (this.jumping) {
        if (!this.canDoubleJump || this.doublejumped) return false;
        if (this.canWallJump(physics)) return true;
    }
    if (!this.groundpoint) return false;

//    return this.grounded;
//    
//    if (!this.grounded) return false;
    
    let groundpoint = this.getGroundPoint();
    let d = distance(this.x + (this.width / 2), this.y + this.height, groundpoint.x, groundpoint.y);
    return d <= this.jumpThreshold;
};

Player.prototype.update = function(now, step, physics) {
    let canjump = this.canJump(physics);
    if (this.jumped && this.falling && !canjump && !this.canWallJump(physics) && !this.canDoubleJump) this.stopJump();
    else if (this.jumped && (canjump || this.canWallJump(physics))) this.doJump();
    this.applyPhysics(physics);
    this.updateLocation(step);
    this.updateCollisionBox();
    this.updateJumpInfo(physics);
    this.updateCameraBox();
}

Player.prototype.applyPhysics = function(physics) {
    if (this.canMoveUp) this.velX *= (this.falling) ? physics.airfriction : physics.friction;
    if (this.canMoveDown)  {
        if (this.velY < physics.terminalVelocity) {
            this.velY += physics.gravity;        
        }
        if (this.isOnWall() && this.falling && this.velY > 0) {
            if ((!this.walltouchside) ||
                ((this.walltouchside == "l") && !this.move_left) ||
                ((this.walltouchside == "r") && !this.move_right)) return;
            this.velY -= physics.wallfriction;
        }
    }
};

Player.prototype.updateLocation = function(step) {

    if (!this.ready) return;
    
    let accel = this.acceleration;
    
    if (this.move_left) {
        if (this.velX > -this.speed) this.velX = this.velX - accel;
    } else if (this.move_right) {
        if (this.velX < this.speed) this.velX = this.velX + accel;    
    }
    
    
    
    let stepX = this.velX;
    let stepY = this.velY;
    
    if (this.floating) {
        let g = Number(this.environment.gravity);
        let v = Number(this.environment.viscosity);
        stepX *=  v;
        if (stepY > 0) stepY *= v;
        else if (stepY < 0) stepY *= g;
    }

    step = 1;
    
    if ((this.velX < 0 && this.canMoveLeft) || (this.velX > 0 && this.canMoveRight)) this.x += stepX * step;
    if ((this.velY < 0 && this.canMoveUp) || (this.velY > 0 && this.canMoveDown)) this.y += stepY * step;
    
    this.x = clamp(this.x);
    this.y = clamp(this.y);
    
    if (this.grounded) this.groundpoint.x = this.x + (this.width / 2);    
};

Player.prototype.getDirection = function(now) {

    let lookLeft = this.isLookingLeft(now);
    let lookRight = this.isLookingRight(now);

    if (this.isOnWall()) {
        if (this.walltouchside=="l" && lookLeft) return "right";
        else if (this.walltouchside=="r" && lookRight) return "left";
    }

    if (lookLeft) return "left";
    else if (lookRight) return "right";
    else return "front";
}

Player.prototype.getState = function(now, dir) {
    let state = "";
    if (!this.alive) state = "dead";
    else if (this.falling && this.velY > 0) state = "fall";
    else if (this.falling && this.velY < 0) state = "jump";
    else if (this.jumping) state = "jump";
    else if ((this.canMoveLeft && this.isMovingLeft()) || (this.canMoveRight && this.isMovingRight())) state = "walk";
    else state = "idle";
    return state;
}

Player.prototype.translate = function(dx, dy) {
    if (this.character) this.character.translate(dx, dy, this.velX > 0, this.velY > 0);    
}
    
Player.prototype.draw = function(now, ctx, x, y, width, height, scale) {
    
//    if (!this.ready) return;
    
    // todo: fade in
    
    let dir = this.getDirection(now);
    let state = this.getState(now, dir);
    
    if (state == "idle") this.idle(now);
    
    let s = this.width / width;

    
    if (this.debug) {
        ctx.fillStyle = "white";
        ctx.globalAlpha = 0.4;
        drawRect(ctx, x, y, width, height, scale);
        ctx.globalAlpha = 1;
    }
    
    if (this.character) this.character.draw(now, ctx, this.color, x, y, width, height, dir, state, s);
    else {
        ctx.fillStyle = this.color;
        drawShape(ctx, x, y, width, height, scale);
    }
    
    
    if (this.debug) this.drawDebug(now, ctx, x, y, width, height, scale);
    
}

    
Player.prototype.idle = function(now) {
    if (!this.isIdle(now)) this.doIdle(now);
    let dt = now - this.idle_start;
    if (this.idle_timeout && dt >= this.idle_timeout) {
        this.lookStop();
        this.doIdle(now);
    }
}

Player.prototype.isIdle = function(now) {
    return (this.look_straight || this.look_left || this.look_right || this.isLookingLeft(now) || this.isLookingRight(now));
}

Player.prototype.doIdle = function(now) {
    let dir = random(0, 2);
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
    let jumpspeed = -this.jumpspeed * 2;
    let jumpspeedsquare = Math.pow(jumpspeed, 2);
    let jumpgravity = 2 * physics.gravity;
    this.maxjumpheight = jumpspeedsquare / jumpgravity;
}

Player.prototype.updateJumpDistance = function(physics) {
}

Player.prototype.resetLevelCollisions = function() {
    this.canMoveUp = true;
    this.canMoveDown = true;
    this.canMoveLeft = true;
    this.canMoveRight = true;
    this.levelcollisions.length = 0;
}

Player.prototype.collideWith = function(collider, result) {

    // todo: only check this if a force has acted on player - movement, hit....?
    
    
    this.floating = false;
    this.environment.gravity = 1;
    this.environment.viscosity = 1;

    if (collider == null) return result;

    result = collide(this, collider, true, result);
    
    if (!result.collided()) {

//        if (this.set) console.log("no touch");
        
        if (this.lastground && !this.jumped && !this.jumping ) {
            
            if (this.lastground.ramp) {
                if ((this.lastground.ramp == "right" && this.velX > 0) || (this.lastground.ramp == "left" && this.velX < 0)) return result;

                // player was on a ramp the last time we checked
                // if they're falling now, it might just be that they are going downhill

                let lastr = new Rectangle(this.lastground.x, this.lastground.y, this.lastground.width, this.lastground.height);
                lastr.ramp = this.lastground.ramp;

                let p = getProjectedPoint(this, lastr);
                if (p) {


                    let ddd = distance(this.x + this.width /2, this.y + this.height, p.x, p.y);

                    if (ddd < 10){

                        this.levelcollisions[this.levelcollisions.length] = {
                            item : lastr,
                            x : this.lastground.x,
                            y : this.lastground.y,
                            width : this.lastground.width,
                            height : this.lastground.height,
                            ramp : this.lastground.ramp,
                            color : "purple",
                            direction : "b",
                            amount : 0
                        }

                        this.falling = false;
                        this.y = p.y - this.height + ddd;
                        this.groundpoint.x = p.x;
                        this.groundpoint.y = p.y;
                        let r = this.lastground.result;
                        r.amount = 0;
                        return r;
                    }
                }
            } else if (this.lastground.actiony) {
                this.falling = false;
                this.y = this.lastground.actiony - this.height;
                this.groundpoint.y = this.lastground.actiony;
                let r = this.lastground.result;
                r.amount = 0;
                return r;
            }
        }
        
        
        return result;
    }

//    this.lastground = null;
    
    if (collider.damage) this.damage(collider.damage);

    if (collider.gravity || collider.viscosity) {
        
        // in water (or something dense)
        
        this.floating = true;
        this.environment.gravity = collider.gravity;
        this.environment.viscosity = collider.viscosity;
        this.falling = false;
        this.grounded = true;
        this.jumpstarty = this.y;
        this.groundpoint.x = this.x + (this.width / 2);
        this.groundpoint.y = this.y + this.height;
        return result;
    }

    let buffer = 1;

    if (result.horizontal.amount) {
        let colh = result.horizontal;
        let dir = colh.direction;
        let amt = colh.amount;

        amt = amt > buffer ? amt : 0;

        this.groundpoint.x = this.x + (this.width / 2);

        if (dir === "l") {
            this.canMoveLeft = false;
            if (this.move_left) this.groundpoint.y = this.y + this.height;
        } else if (dir === "r") {
            this.canMoveRight = false;    
            if (this.move_right) this.groundpoint.y = this.y + this.height;
        }

        this.touchWall(dir, amt);

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
    } else if (result.vertical.amount) {
        let colv = result.vertical;
        let dir = colv.direction;
        let amt = colv.amount;

        amt = amt > buffer ? amt : 0;

        let color = "";
        if (dir === "b") {

            let y = collider.y - this.height;

            if (colv.y) {
                this.groundpoint.x = this.x + (this.width / 2);
                this.groundpoint.y = colv.y;
                if (this.velY >= 0) this.y = this.groundpoint.y - this.height;
            } else {
                this.canMoveDown = false;
                this.groundpoint.x = this.x + (this.width / 2);
                this.groundpoint.y = collider.y - amt;
            }

            this.jumpstarty = this.y - amt;
            
            this.lastground = {
                x : collider.x,
                y : collider.y,
                width : collider.width,
                height : collider.height,
                ramp : collider.ramp,
                color : color,
                direction : dir,
                amount : amt,
                result : result,
                actiony : (collider.action && collider.action.y) ? collider.y : null
            };

            this.touchFloor(amt);
            color = "purple";
        } else if (dir === "t") {
            this.canMoveUp = false;
            this.touchRoof(amt);
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
    }
    return result;
};

Player.prototype.getGroundPoint = function() {
    return this.groundpoint;
}

Player.prototype.updateCameraBox = function() {
    let camx = this.x;
    let camwidth = this.width;
    if (isNaN(this.maxjumpheight)) this.maxjumpheight = 1;
    let camheight = this.maxjumpheight + this.height;
    if (camheight < this.height || isNaN(camheight)) camheight = this.height;
//    let camy = this.groundpoint.y - camheight;
    let camy = this.y + this.height - camheight;
    let jp = this.jumpstarty;
    let dy = jp - this.y;
    camy += dy;
    let dj = this.y - jp;
    if (dj > 5) camy += dj; 
    this.camerabox.x = camx;
    this.camerabox.y = camy;
    this.camerabox.width = camwidth;
    this.camerabox.height = camheight;
}

Player.prototype.updateCollisionBox = function() {
    
//    this.colliders["horizontal"].x = (this.x - this.collisionpad) + this.velX;
    this.colliders["horizontal"].x = this.x - (this.collisionpad / 2);
    this.colliders["horizontal"].y = this.y;
   
    this.colliders["vertical"].x = this.x + (this.collisionpad / 4);
//    this.colliders["vertical"].y = this.y + this.velY + this.collisionpad;
//    this.colliders["vertical"].y = this.y + this.collisionpad;
    this.colliders["vertical"].y = this.y;
 
    let left = this.velX < 0;
    let right = this.velX > 0;
    
    let top = this.colliders["vertical"].y < this.y;
    
    let minx = left ? this.colliders["horizontal"].x : this.x - this.collisionpad;
    let miny = top ? this.colliders["vertical"].y : this.y;
    
    let maxx = right ? this.colliders["horizontal"].x + this.colliders["horizontal"].width : this.x + this.width + this.collisionpad;
    let maxy = top ? this.y + this.height : this.colliders["vertical"].y + this.colliders["vertical"].height;
    
    let width = maxx - minx;
    let height = maxy - miny;
    
    this.collisionbox.x = minx;
    this.collisionbox.y = miny;
    this.collisionbox.width = width;
//    this.collisionbox.height = height + this.collisionpad;
    this.collisionbox.height = height;
}







Player.prototype.drawDebug = function(now, ctx, x, y, width, height, scale) {

    let cx = (this.collisionbox.x - this.x) * scale;
    let cy = (this.collisionbox.y - this.y) * scale;
    this.drawDebugRect(ctx, x + cx, y + cy, scale, this.collisionbox, "yellow");
    
    let hx = (this.colliders["horizontal"].x - this.x) * scale;
    let hy = (this.colliders["horizontal"].y - this.y) * scale;
    this.drawDebugRect(ctx, x + hx, y + hy, scale, this.colliders["horizontal"], this.colliders["horizontal"].color);
    
    let vx = (this.colliders["vertical"].x - this.x) * scale;
    let vy = (this.colliders["vertical"].y - this.y) * scale;
    this.drawDebugRect(ctx, x + vx, y + vy, scale, this.colliders["vertical"], this.colliders["vertical"].color);

    let cbx = (this.camerabox.x - this.x) * scale;
    let cby = (this.camerabox.y - this.y) * scale;
    this.drawDebugRect(ctx, x + cbx, y + cby, scale, this.camerabox, "cyan");
    
    for (let i = 0; i < this.levelcollisions.length; i++) this.drawDebugItem(ctx, x, y, scale, this.levelcollisions[i]);
    
    let gpx = (this.groundpoint.x - this.x) * scale;
    let gpy = (this.groundpoint.y - this.y) * scale;
    let gr = new Rectangle(x + gpx - 2, y + gpy - 4, 4, 8);
    ctx.fillStyle = "white";
    gr.draw(ctx);
    
    this.drawDebugText(ctx, x, y, width, height, scale);
}

Player.prototype.drawDebugText = function(ctx, x, y, width, height, scale) {
    
    let pad = 5 * scale;

    let message = "x:" + this.x + "\ny: " + this.y;

    drawText(ctx, message, "red", x + width + pad, y + pad);
    
}


Player.prototype.drawDebugRect = function(ctx, x, y, scale, rect, color) {
    drawShapeOutline(ctx, color, rect, x, y, rect.width * scale, rect.height * scale, 1, 1, scale);
}

Player.prototype.drawDebugItem = function(ctx, x, y, scale, item) {

    let ix = (item.x - this.x) * scale;
    let iy = (item.y - this.y) * scale;
    
    let color = item.color;
    
    drawShapeOutline(ctx, color, item, x + ix, y + iy, item.width * scale, item.height * scale, 1, 1, scale);
}