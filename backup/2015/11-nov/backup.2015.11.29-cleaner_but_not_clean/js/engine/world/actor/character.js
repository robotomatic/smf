function Character() {
    this.json;
    this.name;
    this.parts;
    this.color;
    this.width;
    this.height;
    this.animator;
    this.renderer;
    this.mbr;
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

Character.prototype.draw = function(ctx, color, x, y, width, height, direction, state, scale)  { 
    this.mbr = {
        "x" : x,
        "y" : y,
        "width" : width,
        "height" : height
    }
    this.animator.animate(this.mbr, direction, state, this);
    this.renderer.draw(ctx, color ? color : this.color, this.animator.getMbr(), this.animator.getCharacter(), scale);
}