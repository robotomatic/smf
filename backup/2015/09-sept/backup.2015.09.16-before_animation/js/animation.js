function Animation() {
    this.name;
    this.parts = {};
    this.duration = 0;
    this.repeat = false;
}

Animation.prototype.loadJson = function(json) {
    this.name = json.name;
    this.duration = json.duration;
    this.repeat = json.repeat;
    for (var part in json.parts) this.parts[part] = json.parts[part];
    return this;
}