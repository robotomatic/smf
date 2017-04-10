"use strict";

function Particle(x, y, size) {
    this.ox = x;
    this.oy = y;
    this.speed = { 
        x : 0, 
        y : 0 
    };    
    this.location = {
        x : 0, 
        y : 0 
    };
    this.renderloc = {
        x : 0,
        y : 0,
        radius : 0
    }
    this.size = size;
    this.radius = 0;
    this.life = 0;
    this.death = 0;
    this.r = 0;
    this.g = 0;
    this.b = 0;    
    this.halflife = 6;
    this.quadlife = 3;
    this.reset();
}

Particle.prototype.reset = function() {
    this.speed = { 
        x : -1 + random() * 2, 
        y : -5 + random() * 5 
    };    
    this.location = {
        x : this.ox, 
        y : this.oy 
    };
    this.radius =  this.size + random() * 1;
    this.life = 10 + random() * 10;
    this.death = this.life;
    this.r = 255;
    this.g = clamp(random() * 155);
    this.b = 0;    
}

Particle.prototype.update = function(point) {
    this.opacity = round(this.death / this.life);
    this.death--;
    this.radius -= 0.3;
    if (this.death > this.halflife) {
        this.location.x += this.speed.x;
        this.location.y += this.speed.y;
    }
    if(this.death < 0 || this.radius < 0) {
        this.reset();
    }
}

Particle.prototype.updateVelocity = function(controller) {
    var velx = controller.velX;
    var velz = controller.velY;
    var vely = controller.velZ;
    this.location.x -= velx;
    this.location.y -= vely;
    this.location.z -= velz;
}

Particle.prototype.translate = function(mbr) {
    var scale = mbr.scale;
    this.renderloc.x = mbr.x + (this.location.x * scale);
    this.renderloc.y = mbr.y + (this.location.y * scale);
    this.renderloc.radius = this.radius * scale;
}