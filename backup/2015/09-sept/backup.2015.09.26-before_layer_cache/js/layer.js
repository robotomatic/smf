function Layer() {
    this.name;
    this.collide = false;
    this.draw = true;
    this.cssblur = "";
    this.blur = false;
    this.scale = 1;
    this.cache = true;
    this.lighten = false;
    this.parallax = 0;
    this.items;
}

Layer.prototype.loadJson = function(json) {
    this.name = json.name;
    this.collide = json.collide;
    this.draw = json.draw;
    this.cssblur = json.cssblur;
    this.blur = json.blur;
    this.scale = json.scale;
    this.cache = (json.cache === false) ? false : true;
    this.lighten = json.lighten;
    this.parallax = json.parallax;
    this.items = json.items;
    return this;
}

Layer.prototype.getItems = function() { return this.items; }