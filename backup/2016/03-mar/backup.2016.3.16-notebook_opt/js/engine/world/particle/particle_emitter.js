"use strict";

function ParticleEmitter(info) {
    
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
    
    this.cp = new Point(0, 0);
    this.lp = new Point(0, 0);
}

ParticleEmitter.prototype.stop = function() {
    this.particles = null;
    this.alive = false;
}

ParticleEmitter.prototype.translate = function(dx, dy, leftright, updown) {
    this.leftright = -leftright;
    this.updown = -updown;
}

ParticleEmitter.prototype.update = function(x, y, scale, ctx) {

    // todo: this needs it's own canvas
    //       flames need to respect origin motion
    //       old particles decouple from origin
    //       proper class separation
    
    if (this.cp.x == 0 && this.cp.y == 0) {
        this.cp.x = x;
        this.cp.y = y;
    } else {
        x += (this.x * scale);
        y += (this.y * scale);
    }
    
    var size = this.size + Math.random() * 1;

    if (!this.particles.length) for(var i = 0; i < this.max; i++) this.particles.push(new Particle(x, y, size));    

    if (!this.alive) return;
    
    ctx.globalCompositeOperation = "lighter";
    
    for(var i = 0; i < this.particles.length; i++) {
        
        var p = this.particles[i];
        
        if (p.death > this.halflife) {
            p.location.x = clamp(p.location.x + (x - this.cp.x));
            p.location.y = clamp(p.location.y + (y - this.cp.y));
        }
        
        if (p.death > this.quadlife) {
            if (this.leftright < 0) p.location.x -= this.leftright * scale;
            else if (this.leftright > 0) p.location.x += this.leftright * scale;
            if (this.updown < 0) p.location.y -= this.updown * scale;
            else if (this.updown > 0) p.location.y += this.updown * scale;
        }
        
        
        p.opacity = Math.round(p.death / p.life * 100) / 100;

//        p.radius *= Math.random() * 1;
        
        if (p.radius > .1) {
        
            var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius * scale);

            gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
            gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
            gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.arc(p.location.x, p.location.y, p.radius * scale, Math.PI * 2, false);
            ctx.fill();
        }
        
        p.death--;
        p.radius -= 0.3;

        if (p.death > this.halflife) {
            p.location.x = clamp(p.location.x + p.speed.x);
            p.location.y = clamp(p.location.y + p.speed.y);
        } else {
            p.location.x = clamp(p.location.x + p.speed.x);
            p.location.y = clamp(p.location.y + p.speed.y);
        }
        
        if (Math.abs(p.location.x - x) > this.maxdx * scale) p.death = -1;
        if (Math.abs(p.location.y - y) > this.maxdy * scale) p.death = -1;
        
        if(p.death < 0 || p.radius < 0) this.particles[i] = new Particle(x, y, this.size + Math.random() * 1);
    }
    
    this.cp.x = clamp(x);
    this.cp.y = clamp(y);
    
    ctx.globalCompositeOperation = "source-over";
}