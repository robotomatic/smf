"use strict";

function Particle(x, y, radius) {
    this.speed = { x : -1 + Math.random() * 2, y : -5 + Math.random() * 5 };    
    this.location = { x : x ? x : 0, y : y ? y : 0 };
    this.radius = radius;
    this.life = 10 + Math.random() * 10;
    this.death = this.life;
    this.r = 255;
    this.g = Math.round(Math.random() * 155);
    this.b = 0;    
}

Particle.prototype.translate = function(dx, dy) {
//    if (dx < this.x) this.x += dx;
//    else this.x -= dx;
//    if (dy < this.y) this.y += dx;
//    else this.y -= dy;
}