"use strict";

function Character() {
    this.json;
    this.id;
    this.name;
    this.emitter;
    this.parts = new CharacterParts();
    this.keys = new Array();
    this.groups = new Array();
    this.colors = new Array();
    this.width;
    this.height;
    this.pad = 10;
    this.idlespeed;
    this.animator = new CharacterAnimator();
    this.renderer = new CharacterRenderer();
    this.hidden;
    this.mbr = new Rectangle();
    
    this.direction = "";
    this.state = "";
    this.paused = false;
}

Character.prototype.loadJson = function(json) {
    this.json = json;
    this.id = json.id;
    this.name = json.name;
    this.width = json.width;
    this.height = json.height;
    this.idlespeed = json.idlespeed;
    if (json.colors) this.colors = json.colors;
    if (json.groups) this.groups = json.groups;
    if (json.parts) this.parts.initialize(this.width, this.height, json.parts);
    this.keys = this.parts.keys;
    if (json.animations) this.animations = json.animations;
    this.hidden = json.hidden;
    if (json.pad) this.pad = json.pad;
    if (json.emitter) {
        this.emitter = new ParticleEmitter(json.emitter);
    }
    return this;
}

Character.prototype.loadAnimations = function(animations) {
    this.animator.loadAnimations(animations);
}


Character.prototype.pause = function(now)  { 
    this.paused = true;
}

Character.prototype.resume = function(now)  { 
    this.paused = false;
}

Character.prototype.update = function(now, player, direction, state)  { 
    this.direction = direction;
    this.state = state;
    if (!this.paused) {
        if (this.emitter && player.box) {
            if (!this.emitter.alive) this.emitter.alive = true;
            var scale = player.box.width / this.width;
            var pl = player.controller.getLocation();
            this.emitter.update(pl, player.controller);
        }
    }
}

Character.prototype.translate = function(window)  { 
    if (this.emitter) this.emitter.translate(window);
}

Character.prototype.draw = function(now, gamecanvas, player, px, py, pad, scale, debug, paused)  { 
    if (!this.paused) this.animator.animate(now, this);
    pad *= scale;
    this.mbr.x = px + pad;
    this.mbr.y = py + pad;
    this.mbr.z = 0;
    this.mbr.width = player.controller.width * scale;
    this.mbr.height = player.controller.height * scale;
    this.renderer.draw(gamecanvas, this, scale, debug);
}