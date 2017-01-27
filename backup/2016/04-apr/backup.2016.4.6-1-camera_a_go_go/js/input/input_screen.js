"use strict";

function ScreenInput(input) {
    this.input = input;
    var si = this;
    this.players = null;
}

ScreenInput.prototype.bindEvents = function() { 
    var p = this.players.players[0];
    this.bind("screen-gamepad-button-left", "mousedown", p, "left", true);
    this.bind("screen-gamepad-button-left", "mouseup", p, "left", false);
    this.bind("screen-gamepad-button-right", "mousedown", p, "right", true);
    this.bind("screen-gamepad-button-right", "mouseup", p, "right", false);
    this.bind("screen-gamepad-button-jump", "mousedown", p, "jump", true);
    this.bind("screen-gamepad-button-jump", "mouseup", p, "jump", false);
    this.bind("screen-gamepad-button-left", "touchstart", p, "left", true);
    this.bind("screen-gamepad-button-left", "touchend", p, "left", false);
    this.bind("screen-gamepad-button-right", "touchstart", p, "right", true);
    this.bind("screen-gamepad-button-right", "touchend", p, "right", false);
    this.bind("screen-gamepad-button-jump", "touchstart", p, "jump", true);
    this.bind("screen-gamepad-button-jump", "touchend", p, "jump", false);
}
    
ScreenInput.prototype.bind = function(id, event, item, action, value) { 
    var elem = document.getElementById(id);
    if (!elem) return;
    var si = this;
    elem.addEventListener(event, function (e) { 
        si.input.do(item, action, value);
        e.preventDefault();
        return false;
    });
}

ScreenInput.prototype.update = function(now) { }

ScreenInput.prototype.setMenu = function(menu) {  }
ScreenInput.prototype.setPlayerChooser = function(chooser) {  }
ScreenInput.prototype.setLevelChooser = function(chooser) {  }
ScreenInput.prototype.setPlayers = function(players) { 
    this.players = players;
    this.bindEvents();
}

