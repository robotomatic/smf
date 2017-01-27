function Characters() {
    this.characters = new Array();
}

Characters.prototype.loadJson = function(json) {
    for (var char in json) {
        this.characters.push(new Character().loadJson(json[char]));
    }
    return this.characters;
}