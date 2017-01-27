function Character() {
    this.name;
    this.parts;
    this.color;
    this.animator;
    this.renderer;
}

Character.prototype.loadJson = function(json) {
    this.name = json.name;
    this.color = json.color;
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

Character.prototype.draw = function(ctx, color, x, y, width, height, state, direction)  { 
    var box = {
        "x" : x,
        "y" : y,
        "width" : width,
        "height" : height
    }
    var animated = this.animator.animate(box, state, direction, this);
    this.renderer.draw(ctx, color, animated.box, animated.character);
}