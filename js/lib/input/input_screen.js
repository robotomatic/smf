"use strict";

function ScreenInput(input) {
    this.input = input;
    this.players = null;
}

ScreenInput.prototype.bindEvents = function() { 
    this.bind("screen-gamepad-button-in", "mousedown", "in", true);
    this.bind("screen-gamepad-button-in", "mouseup", "in", false);
    this.bind("screen-gamepad-button-in", "touchstart", "in", true);
    this.bind("screen-gamepad-button-in", "touchend", "in", false);
    
    this.bind("screen-gamepad-button-out", "mousedown", "out", true);
    this.bind("screen-gamepad-button-out", "mouseup", "out", false);
    this.bind("screen-gamepad-button-out", "touchstart", "out", true);
    this.bind("screen-gamepad-button-out", "touchend", "out", false);
    
    this.bind("screen-gamepad-button-left", "mousedown", "left", true);
    this.bind("screen-gamepad-button-left", "mouseup", "left", false);
    this.bind("screen-gamepad-button-left", "touchstart", "left", true);
    this.bind("screen-gamepad-button-left", "touchend", "left", false);

    this.bind("screen-gamepad-button-right", "mousedown", "right", true);
    this.bind("screen-gamepad-button-right", "mouseup", "right", false);
    this.bind("screen-gamepad-button-right", "touchstart", "right", true);
    this.bind("screen-gamepad-button-right", "touchend", "right", false);
    
    this.bind("screen-gamepad-button-jump", "mousedown", "jump", true);
    this.bind("screen-gamepad-button-jump", "mouseup", "jump", false);
    this.bind("screen-gamepad-button-jump", "touchstart", "jump", true);
    this.bind("screen-gamepad-button-jump", "touchend", "jump", false);
    
    this.bind("screen-gamepad-button-action", "mousedown", "jump", true);
    this.bind("screen-gamepad-button-action", "mouseup", "jump", false);
    this.bind("screen-gamepad-button-action", "touchstart", "jump", true);
    this.bind("screen-gamepad-button-action", "touchend", "jump", false);
}
    
ScreenInput.prototype.bind = function(id, event, action, value) { 
    var elem = document.getElementById(id);
    if (!elem) return;
    var si = this;
    var p = this.players.players[0].controller;
    elem.addEventListener(event, function (e) { 
        si.input.do(p, action, value);
    });
}

ScreenInput.prototype.update = function(now) { }

ScreenInput.prototype.setMenu = function(menu) {  }

ScreenInput.prototype.setPlayers = function(players) { 
    this.players = players;
    this.bindEvents();
}

