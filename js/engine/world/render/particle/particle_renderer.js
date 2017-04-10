"use strict";

function ParticleRenderer(emitter) {
    this.emitter = emitter;
}

ParticleRenderer.prototype.render = function(gamecanvas) {
    if (!this.emitter.alive) return;
    gamecanvas.setCompositeOperation("lighter");
    for(var i = 0; i < this.emitter.particles.length; i++) {
        var p = this.emitter.particles[i];
        if ((p.renderloc.radius) <= .1) continue;
        this.renderParticle(p, gamecanvas);
    }
    gamecanvas.setCompositeOperation("source-over");
}

ParticleRenderer.prototype.renderParticle = function(particle, gamecanvas) {
    var px = particle.renderloc.x;
    var py = particle.renderloc.y
    var pr = particle.renderloc.radius;
    var gradient = gamecanvas.createRadialGradient(px, py, 0, px, py, pr);
    gradient.addColorStop(0, "rgba(" + particle.r + ", " + particle.g + ", " + particle.b + ", " + particle.opacity + ")");
    gradient.addColorStop(0.5, "rgba(" + particle.r + ", " + particle.g + ", " + particle.b + ", " + particle.opacity + ")");
    gradient.addColorStop(1, "rgba(" + particle.r + ", " + particle.g + ", " + particle.b + ", 0)");
    gamecanvas.setFillStyle(gradient);
    gamecanvas.beginPath();
    var c = geometryfactory.getCircle(px, py, pr);
    c.draw(gamecanvas);
}
