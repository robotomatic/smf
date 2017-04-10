"use strict";

function ParticleEmitter(info) {

    // todo: this needs its own canvas
    //       flames need to respect origin motion
    //       old particles decouple from origin
    //       proper class separation

    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.size = info.size;
    
    this.cp = new Point(0, 0);
    
    this.max = 10;
    this.particles = new Array();

    this.alive = false;
    
    this.trans = {
        x : 0,
        y : 0,
        z : 0,
        scale : 0
    };
    
    for(var i = 0; i < this.max; i++) {
        this.particles.push(new Particle(this.x, this.y, this.size));    
    }
    
    this.renderer = new ParticleRenderer(this);
}

ParticleEmitter.prototype.stop = function() {
    this.particles.length = 0;
    this.alive = false;
}

ParticleEmitter.prototype.translate = function(mbr) {
    var scale = mbr.scale;
    this.trans.x = round((this.x - mbr.x) * scale);
    this.trans.y = round((this.y - mbr.y) * scale);
    this.trans.z = round((this.z - mbr.z) * scale);
    this.trans.scale = scale;
    for(var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        p.translate(mbr);
    }
}

ParticleEmitter.prototype.update = function(point) {
    this.cp.x = point.x - this.x;
    this.cp.y = point.y - this.y;
    this.cp.z = point.z - this.z;
    for(var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        p.update(this.cp);
    }
}

ParticleEmitter.prototype.render = function(gamecanvas) {
    this.renderer.render(gamecanvas);
}