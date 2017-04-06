"use strict";

function ParticleRenderer(emitter) {
    this.emitter = emitter;
}

ParticleRenderer.prototype.render = function(x, y, scale, gamecanvas) {
    if (!this.emitter.alive) return;
    gamecanvas.setCompositeOperation("lighter");
    
    for(var i = 0; i < this.emitter.particles.length; i++) {
        var p = this.emitter.particles[i];
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