Theme = function(name) {
    this.name = name;
    this.background = "";
}

Theme.prototype.loadJson = function(json) {
    this.background = json.background;
    this.items = json.items;
    return this;
}