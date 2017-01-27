Menu = function() {
    this.running = false;
    this.busy = false;
}

Menu.prototype.load = function() {}

Menu.prototype.start = function() { this.running = true; }

Menu.prototype.stop = function() { this.running = false; }

Menu.prototype.resize = function() { 
    this.positionButtons();
}

Menu.prototype.positionButtons = function() {
    var prev = document.getElementsByClassName("menu-game-player-view-player-button-prev");
    if (prev.length) positionElements(prev);
    var next = document.getElementsByClassName("menu-game-player-view-player-button-next");
    if (next.length) positionElements(next);
}

