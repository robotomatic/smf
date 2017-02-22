"use strict";

function Particle(x, y, radius) {
    this.speed = { x : -1 + MATH_RANDOM() * 2, y : -5 + MATH_RANDOM() * 5 };    
    this.location = { x : x ? x : 0, y : y ? y : 0 };
    this.radius = radius;
    this.life = 10 + MATH_RANDOM() * 10;
    this.death = this.life;
    this.r = 255;
    this.g = MATH_ROUND(MATH_RANDOM() * 155);
    this.b = 0;    
}

Particle.prototype.translate = function(dx, dy) {
//    if (dx < this.x) this.x += dx;
//    else this.x -= dx;
//    if (dy < this.y) this.y += dx;
//    else this.y -= dy;
}