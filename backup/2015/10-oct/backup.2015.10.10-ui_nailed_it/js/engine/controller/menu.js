function Menu(devtools) {
    this.running = false;
    this.busy = false;
    this.devtools = devtools;
}

Menu.prototype.load = function() {}
Menu.prototype.start = function() { this.running = true; }
Menu.prototype.stop = function() { this.running = false; }
Menu.prototype.resize = function() { 
    this.positionButtons(); 
    this.devtools.resize();
}

Menu.prototype.positionButtons = function() {
    var prev = document.getElementsByClassName("menu-game-player-view-player-button-prev");
    if (prev.length) positionElements(prev);
    var next = document.getElementsByClassName("menu-game-player-view-player-button-next");
    if (next.length) positionElements(next);
}

