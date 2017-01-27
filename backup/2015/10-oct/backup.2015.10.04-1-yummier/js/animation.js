function Animation() {
    this.name;
    this.duration = 0;
    this.repeat = false;
    this.width;
    this.height;
    this.x;
    this.y;
    this.parts = {};
    this.override = false;
}

Animation.prototype.loadJson = function(json) {
    this.name = json.name;
    this.duration = json.duration;
    this.repeat = json.repeat;
    this.width = json.width;
    this.height = json.height;
    this.x = json.x;
    this.y = json.y;
    for (var part in json.parts) this.parts[part] = json.parts[part];
    this.override = json.override;
    return this;
}