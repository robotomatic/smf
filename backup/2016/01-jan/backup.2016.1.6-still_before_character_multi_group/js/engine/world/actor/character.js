function Character() {
    this.json;
    this.name;
    this.parts;
    this.color;
    this.width;
    this.height;
    this.animator;
    this.renderer;
    this.mbr = new Rectangle();
}

Character.prototype.loadJson = function(json) {
    this.json = json;
    this.name = json.name;
    this.color = json.color;
    this.width = json.width;
    this.height = json.height;
    this.parts = json.parts;
    this.animations = json.animations;
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
    this.renderer.draw(ctx, color ? color : this.color, this.animator.getMbr(), this.animator.getCharacter(), scale);
}