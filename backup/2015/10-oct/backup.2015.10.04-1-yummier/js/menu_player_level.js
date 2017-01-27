MenuPlayerLevel = function() {
    this.levels = null;
    this.currentlevel = localStorage.getItem("player-level");
    if (!this.currentlevel) this.currentlevel = 0;
    return this;
}

MenuPlayerLevel.prototype.menu = new Menu("player level ");

MenuPlayerLevel.prototype.load = function() {
    var prev = document.getElementById("menu-game-player-view-player-button-prev");
    if (prev) prev.onclick = function(e) {
        this.showPrevLevel();
        e.preventDefault();
        return false;
    }
    var next = document.getElementById("menu-game-player-view-player-button-next");
    if (next) next.onclick = function(e) {
        this.showNextLevel();
        e.preventDefault();
        return false;
    }
}

MenuPlayerLevel.prototype.start = function() {
    this.menu.start();
}

MenuPlayerLevel.prototype.stop = function() {
    this.menu.stop();
}

MenuPlayerLevel.prototype.resize = function() {
    this.menu.resize();
    this.showLevelName();
}

MenuPlayerLevel.prototype.showPrevLevel = function() {

}

MenuPlayer.prototype.showNextLevel = function() {

}

MenuPlayerLevel.prototype.showLevelName = function() {
    /*
    if (!this.characters) return;
    var m = document.getElementById("menu-text");
    if (!m) return;
    var p = m.parentNode;
    var pw = p.offsetWidth;
    var fs = Number(pw / 25);
    if (fs > 15) fs = 15;
    m.style.fontSize = fs + "px";
    var keys = Object.keys(this.characters);
    m.innerHTML = this.characters[keys[this.currentchar]].name;
    fadeInFast(m);
    
    
    // todo: make this more efficient
    localStorage.setItem("player-character", this.currentchar);
    */
}
