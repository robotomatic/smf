function Player(name, color, x, y, width, height, speed, character) {
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
    this.move_left = false;
    this.move_right = false;
    this.lastMoveLeft;
    this.lastMoveRight;
    this.lastDirection;
    this.lookThreshold = .4;
    this.jumping = false;
    this.jumped = false;
    this.jumpReleased = true;
    this.jumpThreshold = 0.2;
    this.wallJumpThreshold = 0.15;
    this.canDoubleJump = false;
    this.doublejumped = false;
    this.canFly = false;
    this.grounded = false;
    this.onwall = false;
    this.walltouchside = null;
    this.lastwalltouch = null;
    this.falling = true;
    this.lastfloortouch = null;
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
    if (Math.abs(this.velY) < 0) this.velY = 0;
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

Player.prototype.applyPhysics = function(physics) {
    this.velX *= (this.falling) ? physics.airfriction : physics.friction;
    if (this.velY < physics.terminalVelocity) this.velY += physics.gravity;        
    if (this.onwall && this.falling && this.velY > 0) this.velY -= physics.wallfriction;
};

Player.prototype.updateLocation = function() {
    this.x += this.velX;
    this.y += this.velY;
};

Player.prototype.update = function(physics) {
    var canjump = this.canJump(physics);
    var canwalljump = this.canWallJump(physics);
    if (this.falling && !canjump && !canwalljump && !this.canDoubleJump) this.stopJump();
    else if (this.jumped && (canjump || canwalljump)) this.doJump();
    if (this.isMovingLeft()) this.moveLeft();
    else if (this.isMovingRight()) this.moveRight();
    this.applyPhysics(physics);
    this.updateLocation();
}

Player.prototype.collideWith = function(collider) {
    if (collider == null) return;
    var col = collide(this, collider);
    if (col) {
        var dir = col.direction;
        var amt = col.amount;
        if (dir === "b") this.touchFloor(amt);
        else if (dir === "t") this.touchRoof(amt);
        else if (dir === "l" || dir === "r") this.touchWall(dir, amt);
    }
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

Player.prototype.draw = function(ctx, x, y, width, height) {
    if (this.character) this.character.draw(ctx, this.color, x, y, width, height, this.getAnimationStates());
    else {
        ctx.fillStyle = this.color;
        drawRect(ctx, x, y, width, height);
    }
}