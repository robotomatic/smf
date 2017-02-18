"use strict";

function Character() {
    this.json;
    this.id;
    this.name;
    this.emitter;
    this.parts;
    this.groups;
    this.color;
    this.width;
    this.height;
    this.pad;
    this.idlespeed;
    this.animator;
    this.renderer;
    this.hidden;
    this.mbr = new Rectangle();
    
    this.direction = "";
    this.state = "";
    
}

Character.prototype.loadJson = function(json) {
    this.json = json;
    this.id = json.id;
    this.name = json.name;
    this.color = json.color;
    this.width = json.width;
    this.height = json.height;
    this.pad = json.pad;
    this.idlespeed = json.idlespeed;
    this.groups = json.groups;
    this.parts = json.parts;
    this.animations = json.animations;
    this.hidden = json.hidden;
    if (json.emitter) this.emitter = new ParticleEmitter(json.emitter);
    return this;
}

Character.prototype.setAnimator = function(animator) {
    this.animator = animator;
}

Character.prototype.setRenderer = function(renderer) {
    this.renderer = renderer;
}

Character.prototype.update = function(now, direction, state)  { 
    this.direction = direction;
    this.state = state;
}

Character.prototype.translate = function(dx, dy, leftright, updown)  { 
    if (this.emitter) this.emitter.translate(dx, dy, leftright, updown);
}

Character.prototype.draw = function(now, ctx, player, scale, pad)  { 
    this.animator.animate(now, this);
    if (this.emitter) {
        if (!this.emitter.alive) this.emitter.alive = true;
        this.emitter.update(player.box.x, player.box.y, player.box.width / this.width, ctx);
    }
    this.mbr.x = pad;
    this.mbr.y = pad;
    this.mbr.z = 0;
    this.mbr.width = player.box.width * scale;
    this.mbr.height = player.box.height * scale;
    this.renderer.draw(ctx, this);
}