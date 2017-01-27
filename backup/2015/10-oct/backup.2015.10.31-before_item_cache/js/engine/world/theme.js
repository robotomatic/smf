Theme = function(name) {
    this.name = name;
    this.background = "";
    this.items = null;
}

Theme.prototype.loadJson = function(json) {
    this.background = json.background;
    this.items = json.items;
    return this;
}