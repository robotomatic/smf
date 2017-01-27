function Character() {
    this.json;
    this.name;
    this.parts;
    this.groups;
    this.color;
    this.width;
    this.height;
    this.height;
    this.debug;
    this.idlespeed;
    this.animator;
    this.renderer;
    this.hidden;
    this.mbr = new Rectangle();
}

Character.prototype.loadJson = function(json) {
    this.json = json;
    this.name = json.name;
    this.color = json.color;
    this.width = json.width;
    this.height = json.height;
    this.debug = json.debug;
    this.idlespeed = json.idlespeed;
    this.groups = json.groups;
    this.parts = json.parts;
    this.animations = json.animations;
    this.hidden = json.hidden;
    return this;
}

Character.prototype.setAnimator = function(animator) {
    this.animator = animator;
}

Character.prototype.setRenderer = function(renderer) {
    this.renderer = renderer;
}

Character.prototype.draw = function(now, ctx, color, x, y, width, height, direction, state, scale)  { 
    this.mbr.x = x;
    this.mbr.y = y;
    this.mbr.width = width;
    this.mbr.height = height;
    this.animator.animate(now, this.mbr, direction, state, this);
    this.renderer.draw(ctx, color ? color : this.color, this.animator.getMbr(), this.animator.getCharacter(), scale, this.debug);
}