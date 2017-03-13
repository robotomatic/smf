"use strict";

function Layer() {
    this.name;

    this.collide = false;
    
    this.physics = false;
    this.gravity = null;
    this.viscosity = null;
    this.damage = null;
    
    this.draw = true;
    this.drawdetails = true;

    this.preview = false;

    this.zindex = 0;

    this.graphics = "main";
    this.blur = 0;
    this.opacity = 1;
    this.blend = "";

    this.scale = 1;

    this.cache = false;

    this.animate = false;
    this.lighten = false;

    this.parallax = 0;
    this.offsetx = 0;
    
    this.depth = 0;
    this.top = false;

    this.outline = false;
    this.outlinewidth = null;

    this.items = new Items();
}

Layer.prototype.loadJson = function(json) {
    this.name = json.name;
    this.collide = json.collide;
    this.physics = json.physics;
    this.gravity = json.gravity;
    this.viscosity = json.viscosity;
    this.damage = json.damage;
    this.draw = json.draw;
    this.drawdetails = (json.drawdetails === false) ? false : true;;
    this.zindex = json.zindex;
    this.preview = json.preview;
    if (json.graphics) this.graphics = json.graphics;
    this.blur = json.blur;
    this.opacity = json.opacity;
    this.blend = json.blend;
    this.scale = (json.scale) ? json.scale : 1;
    this.cache = (json.cache === true) ? true : false;
    this.animate = json.animate;
    this.lighten = json.lighten;
    this.parallax = json.parallax;
    this.offsetx = json.offsetx;
    this.depth = json.depth;
    this.top = json.top;
    this.outline = json.outline;
    this.outlinewidth = json.outlinewidth;
    
    this.items.loadJson(json.items, this.collide);

    return this;
}

Layer.prototype.update = function(now, delta, renderer) { 
    this.items.update(now, delta, renderer, this.depth);
}