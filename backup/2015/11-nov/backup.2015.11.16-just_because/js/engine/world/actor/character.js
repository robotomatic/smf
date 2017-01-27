function Character() {
    this.json;
    this.name;
    this.parts;
    this.color;
    this.width;
    this.height;
    this.animator;
    this.renderer;
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

Character.prototype.draw = function(ctx, color, x, y, width, height, animationstates, outline, scale)  { 
    var box = {
        "x" : x,
        "y" : y,
        "width" : width,
        "height" : height
    }
    var animated = this.animator.animate(box, animationstates, this);
    this.renderer.draw(ctx, color ? color : this.color, animated.box, animated.character, outline, scale);
}