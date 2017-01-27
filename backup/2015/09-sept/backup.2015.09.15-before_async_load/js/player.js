function Player(color, x, y, width, height, speed) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.velX = 0;
    this.velY = 0;
    this.move_left = false;
    this.move_right = false;
    this.jumping = false;
    this.jumped = false;
    this.jumpReleased = true;
    this.canDoublejump = false;
    this.doublejumped = false;
    this.canFly = false;
    this.grounded = false;
    this.onwall = false;
    this.walltouchside = null;
    this.lastwalltouch = null;
    this.falling = false;
    this.lastfloortouch = null;
}

Player.prototype.left = function(left) { this.move_left = left; };
Player.prototype.isMovingLeft = function() { return this.move_left; };
Player.prototype.moveLeft = function() { if (this.velX > -this.speed) this.velX--; }

Player.prototype.right = function(right) { this.move_right = right; };
Player.prototype.isMovingRight = function() { return this.move_right; };
Player.prototype.moveRight = function() { if (this.velX < this.speed) this.velX++; }

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
    if ( dt < physics.wallJumpThreshold ) {
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
    this.lastfloortouch = timestamp();
    this.doublejumped = false;
    this.grounded = true;
    this.jumping = false;
    this.falling = false;
    this.onwall = false;
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
        if (!this.canDoublejump || this.doublejumped) return false;
        if (!this.canWallJump(physics)) this.doublejumped=true;
        return true;
    }
    var now = timestamp();
    var dt = (now - this.lastfloortouch) / 1000;
    return dt < physics.jumpThreshold;
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
    if (this.falling && !canjump && !canwalljump && !this.canDoublejump) this.stopJump();
    else if (this.jumped && (canjump || canwalljump)) this.doJump();
    if (this.isMovingLeft()) this.moveLeft();
    else if (this.isMovingRight()) this.moveRight();
    this.applyPhysics(physics);
    this.updateLocation();
}

Player.prototype.collideWith = function(collider) {
    var col = collide(this, collider);
    if (col) {
        var dir = col.direction;
        var amt = col.amount;
        if (dir === "b") this.touchFloor(amt);
        else if (dir === "t") this.touchRoof(amt);
        else if (dir === "l" || dir === "r") this.touchWall(dir, amt);
    }
};