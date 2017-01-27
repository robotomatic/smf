function Player(id, name, color, x, y, width, height, speed, character) {

    this.id = id;
    
    this.name = name;
    this.color = color;
    
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.speed = speed;
    
    this.character = character;
    
    this.velX = 0;
    this.velY = 0;
    
    this.canMoveUp = true;
    this.canMoveDown = true;
    this.canMoveLeft = true;
    this.canMoveRight = true;
    
    this.move_left = false;
    this.move_right = false;
    this.lastMoveLeft;
    this.lastMoveRight;
    this.lastDirection;
    
    this.lookThreshold = .4;
    
    ping = false;
    this.jumped = false;
    this.jumpReleased = true;
    this.jumpThreshold = 0.2;
    this.wallJumpThreshold = 0.15;
    this.canDoubleJump = false;
    this.doublejumped = false;
    
    this.canFly = false;
    
    this.grounded = false;
    this.lastfloortouch = null;
    
    this.onwall = false;
    this.walltouchside = null;
    this.lastwalltouch = null;
    
    this.falling = true;
    
    // todo: set jump distance and plot jump landing
    this.maxjumpheight = 0;
    this.maxjumpdistance = 0;
    this.jumpheight = 0;
    this.jumpdistance = 0;

    this.jumpstarty = null;
    this.jumpendy = null;
    
    this.camerabox = null;
    this.cameray = 0;

    this.collisionpad = 2;
    this.colliders = new Array();
    this.colliders["horizontal"] = {
        color: "orange",
        x : this.x - this.collisionpad,
        y : this.y,
        width : this.width + (this.collisionpad * 2),
        height : this.height / 1.1
    };
    this.colliders["vertical"] = {
        color: "magenta",
        x : this.x + this.collisionpad,
        y : this.y,
        width : this.width - (this.collisionpad * 2),
        height : this.height - this.collisionpad
    };
    this.collisionbox = {
        x : 0, 
        y : 0, 
        width : 0, 
        height : 0
    }
    
    this.levelcollisions = new Array();
}

Player.prototype.moveTo = function(where) {
    if (where.x) this.x += where.x;
    if (where.y) this.y += where.y;
}

Player.prototype.stop = function() { 
    this.velX = 0;
    this.move_left = false;
    this.move_right = false;
}

Player.prototype.loadJson = function(json) { 
    for (var key in json) this[key]= json[key]; 
    return this;
};

Player.prototype.setCharacter = function(character) { 
    this.character = character; 
}

Player.prototype.left = function(left) { 
    this.move_left = left; 
    this.lastMoveRight = null;
    this.lastDirection = "left";
    if (left) {
        this.lastMoveLeft = timestamp();
    }
};
Player.prototype.isMovingLeft = function() { return this.move_left; };
Player.prototype.moveLeft = function() { if (this.velX > -this.speed) this.velX--; }
Player.prototype.isLookingLeft = function() { 
    if (this.move_left) return true;
    if (this.isFalling && !this.grounded && this.lastDirection == "left") {
        this.lastMoveLeft = timestamp();
        return true;
    }
    var now = timestamp();
    var dt = (now - this.lastMoveLeft) / 1000;
    return dt <= this.lookThreshold;
}

Player.prototype.right = function(right) { 
    this.move_right = right; 
    this.lastMoveLeft = null;
    this.lastDirection = "right";
    if (right) {
        this.lastMoveRight = timestamp();
    }
};
Player.prototype.isMovingRight = function() { return this.move_right; };
Player.prototype.moveRight = function() { if (this.velX < this.speed) this.velX++; }
Player.prototype.isLookingRight = function() { 
    if (this.move_right) return true;
    if (this.isFalling && !this.grounded && this.lastDirection == "right") {
        this.lastMoveRight = timestamp();
        return true;
    }
    var now = timestamp();
    var dt = (now - this.lastMoveRight) / 1000;
    return dt <= this.lookThreshold;
}

Player.prototype.touchWall = function(side, amount) {
    if (side==="l") this.x += amount;
    else this.x -= amount;
    this.velX = -this.velX / 2;
    this.walltouchside = side;
    this.lastwalltouch = timestamp();
    this.onwall = true;
};
Player.prototype.isOnWall = function() { return this.onwall; }

Player.prototype.canWallJump = function(physics) {
    if (this.canFly) return true;
    var now = timestamp();
    var dt = (now - this.lastwalltouch) / 1000;
    if ( dt < this.wallJumpThreshold ) {
        if (this.walltouchside=="l" && this.move_right) return true;
        else if (this.walltouchside=="r" && this.move_left) return true;
    }
    return false;
};

Player.prototype.touchRoof = function(amount) {
    this.y += amount;
    this.velY *=  (this.velY > 0) ? 1 : -1    
};

Player.prototype.touchFloor = function(amount) {

    this.y -= amount;
    
    this.velY = -this.velY / 3; 
    if (Math.abs(this.velY) < 1) this.velY = 0;
    
    
    this.lastfloortouch = timestamp();
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
    if (jump) {
        this.jumped = (this.jumpReleased) ? true : false;
        this.jumpReleased = false;
    } else {
        this.jumped = jump;
        this.jumpReleased = true;
    }
};

Player.prototype.doJump = function() {
    this.velY = -this.speed * 2;
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
    if (!this.jumped) return false;
    if (this.canFly) return true;
    if (this.jumping) {
        if (!this.canDoubleJump || this.doublejumped) return false;
        if (!this.canWallJump(physics)) this.doublejumped=true;
        return true;
    }
    var now = timestamp();
    var dt = (now - this.lastfloortouch) / 1000;
    return dt < this.jumpThreshold;
};

Player.prototype.update = function(step, physics) {
    var canjump = this.canJump(physics);
    var canwalljump = this.canWallJump(physics);
    if (this.falling && !canjump && !canwalljump && !this.canDoubleJump) this.stopJump();
    else if (this.jumped && (canjump || canwalljump)) this.doJump();
    if (this.isMovingLeft()) this.moveLeft();
    else if (this.isMovingRight()) this.moveRight();
    this.applyPhysics(physics);
    this.updateLocation();
    this.updateCollisionBox();
    this.updateJumpInfo(physics);
    this.updateCameraBox();
}

Player.prototype.applyPhysics = function(physics) {
    if (this.canMoveUp) this.velX *= (this.falling) ? physics.airfriction : physics.friction;
    if (this.canMoveDown)  {
        if (this.velY < physics.terminalVelocity) this.velY += physics.gravity;        
        if (this.onwall && this.falling && this.velY > 0) this.velY -= physics.wallfriction;
    }
};

Player.prototype.updateLocation = function() {
    if ((this.velX < 0 && this.canMoveLeft) || (this.velX > 0 && this.canMoveRight)) this.x += this.velX;
    if ((this.velY < 0 && this.canMoveUp) || (this.velY > 0 && this.canMoveDown)) this.y += this.velY;
};

Player.prototype.getState = function() {
    var state = "";
    if (this.falling && this.velY > 0) state = "fall";
    else if (this.falling && this.velY < 0) state = "jump";
    else if (this.jumping) state = "jump";
    else if (this.isMovingLeft() || this.isMovingRight()) state = "walk";
    return state;
}

Player.prototype.getDirection = function() {
    var lookLeft = this.isLookingLeft();
    var lookRight = this.isLookingRight();
    /*
    var now = timestamp();
    var dt = (now - this.lastwalltouch) / 1000;
    if ( dt < this.wallJumpThreshold ) {
        if (this.walltouchside=="l" && lookLeft) return "look_right";
        else if (this.walltouchside=="r" && lookRight) return "look_left";
    }
    */
    if (lookLeft) return "left";
    else if (lookRight) return "right";
    else return "";
}

Player.prototype.getAnimationStates = function() {
    var direction = this.getDirection();
    var state = this.getState();
    return (state || direction) ? new Array(direction, state, (state && direction) ? state + "_" + direction : "") : "";
}

Player.prototype.draw = function(ctx, x, y, width, height, outline) {
   if (this.character) this.character.draw(ctx, this.color, x, y, width, height, this.getAnimationStates(), outline);
    else {
        ctx.fillStyle = this.color;
        drawRect(ctx, x, y, width, height);
    }
}

Player.prototype.updateJumpInfo = function(physics) {
    this.updateJumpHeight(physics);
    this.updateJumpDistance(physics);
}

Player.prototype.updateJumpHeight = function(physics) {
    var jumpspeed = -this.speed * 2;
    var jumpspeedsquare = Math.pow(jumpspeed, 2);
    var jumpgravity = 2 * physics.gravity;
    this.maxjumpheight = jumpspeedsquare / jumpgravity;
}

Player.prototype.updateJumpDistance = function(physics) {
}


Player.prototype.updateCollisionBox = function() {
    
    this.colliders["horizontal"].x = (this.x - this.collisionpad) + this.velX;
    this.colliders["horizontal"].y = this.y;
   
    this.colliders["vertical"].x = this.x + this.collisionpad;
    this.colliders["vertical"].y = this.y + this.velY + this.collisionpad;
 
    var left = this.velX < 0;
    var right = this.velX > 0;
    
    var top = this.colliders["vertical"].y < this.y;
    
    var minx = left ? this.colliders["horizontal"].x : this.x - this.collisionpad;
    var miny = top ? this.colliders["vertical"].y : this.y;
    
    var maxx = right ? this.colliders["horizontal"].x + this.colliders["horizontal"].width : this.x + this.width + this.collisionpad;
    var maxy = top ? this.y + this.height : this.colliders["vertical"].y + this.colliders["vertical"].height;
    
    var width = maxx - minx;
    var height = maxy - miny;
    
    this.collisionbox = {
        x : minx,
        y : miny,
        width: width,
        height : height + this.collisionpad
    }
}

Player.prototype.resetLevelCollisions = function() {
    this.canMoveUp = true;
    this.canMoveDown = true;
    this.canMoveLeft = true;
    this.canMoveRight = true;
    this.levelcollisions = new Array();
}

Player.prototype.collideWith = function(collider) {
    if (collider == null) return;
    var col = collide(this, collider, true);
    if (col) {
        if (col["horizontal"]) {
            var colh = col["horizontal"];
            var dir = colh.direction;
            var amt = colh.amount;
            
            amt = amt > this.collisionpad ? amt : 0;
            
            if (dir === "l") this.canMoveLeft = false;
            else if (dir === "r") this.canMoveRight = false;    
            
            this.touchWall(dir, amt);
            var color = "magenta";
            this.levelcollisions[this.levelcollisions.length] = {
                item : collider,
                color : color,
                direction : dir,
                amount : amt
            }
        }
        if (col["vertical"]) {
            var colv = col["vertical"];
            var dir = colv.direction;
            var amt = colv.amount;
            
            amt = amt > this.collisionpad ? amt : 0;
            
            var color = "";
            if (dir === "b") {
                this.canMoveDown = false;
                
                var y = collider.y - this.height;
                this.jumpstarty = y;
                
                this.touchFloor(amt);
                color = "white";
            } else if (dir === "t") {
                this.canMoveUp = false;
                this.touchRoof(amt);
                color = "blue";
            }
            this.levelcollisions[this.levelcollisions.length] = {
                item : collider,
                color : color,
                direction : dir,
                amount : amt
            }
        }
        return col;
    }
    return null;
};



Player.prototype.updateCameraBox = function() {
    var camx = this.x;
    var camwidth = this.width;
    var camheight = this.maxjumpheight + this.height;
    var camy = this.y + this.height - camheight;
    var jp = this.jumpstarty;
    var dy = jp - this.y;
    camy += dy;
    var dj = this.y - jp;
    if (dj > 0) camy += dj; 
    this.camerabox = {
        x: camx,
        y: camy,
        width: camwidth,
        height: camheight
    }
}
