"use strict";

function ParticleEmitter(info) {

    // todo: this needs its own canvas
    //       flames need to respect origin motion
    //       old particles decouple from origin
    //       proper class separation
    
    this.x = info.x;
    this.y = info.y;
    this.size = info.size;
    
    this.max = 10;
    this.particles = new Array();

    this.halflife = 6;
    this.quadlife = 3;
    
    this.maxdx = 75;
    this.maxdy = 75;
    
    this.alive = false;
    
    this.leftright = 0;
    this.updown = 0;
    
    this.cp = new Point(this.x, this.y);
    
    for(var i = 0; i < this.max; i++) {
        var size = this.size + random() * 1;
        this.particles.push(new Particle(this.cp.x, this.cp.y, size));    
    }
}

ParticleEmitter.prototype.stop = function() {
    this.particles.length = 0;
    this.alive = false;
}

ParticleEmitter.prototype.translate = function(dx, dy, leftright, updown) {
    // no workee
//    this.leftright = -leftright;
//    this.updown = -updown;
}

ParticleEmitter.prototype.update = function() {
    for(var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        p.opacity = round(p.death / p.life);
        p.death--;
        p.radius -= 0.3;
        if (p.death > this.halflife) {
            p.location.x = clamp(p.location.x + p.speed.x);
            p.location.y = clamp(p.location.y + p.speed.y);
        }
        if (p.location.x > this.maxdx) p.death = -1;
        if (p.location.y > this.maxdy) p.death = -1;
        if(p.death < 0 || p.radius < 0) {
            this.particles[i].reset(this.cp.x, this.cp.y, this.size + random() * 1);
        }
    }
}

ParticleEmitter.prototype.render = function(x, y, scale, gamecanvas) {
    if (!this.alive) return;
    gamecanvas.setCompositeOperation("lighter");
    
    for(var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        if ((p.radius * scale) <= .1) continue;
            
        var px = x + (p.location.x * scale);
        var py = y + (p.location.y * scale);
        var pr = p.radius * scale;

        var gradient = gamecanvas.createRadialGradient(px, py, 0, px, py, p.radius * scale);
        gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
        gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
        gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
        gamecanvas.setFillStyle(gradient);
        gamecanvas.beginPath();

        var c = geometryfactory.getCircle(px, py, pr);
        c.draw(gamecanvas);
    }
    
    gamecanvas.setCompositeOperation("source-over");
}