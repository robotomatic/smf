"use strict";

function Menu(loader, devtools, settings) {
    this.running = false;
    this.busy = false;
    this.devtools = devtools;
    this.settings = settings;
}

Menu.prototype.getSettings = function() { return null; }

Menu.prototype.load = function() {}
Menu.prototype.start = function() { 
    var button = document.getElementById("main-content-game-button");
    button.className = button.className.replace(/button-disabled/g, '');
    if (button.className.indexOf("bg-color-ok") == -1) button.className += " bg-color-ok";
    //fadeIn(document.getElementById("main-logo"));
    this.running = true; 
}
Menu.prototype.stop = function() { this.running = false; }
Menu.prototype.resize = function() { 
    //this.devtools.resize(); 
}