"use strict";

function Input() {
    this.inputs = new Array();
    this.inputs[0] = new KeyboardInput(this);
    this.inputs[1] = new GamepadInput(this);
    this.inputs[2] = new ScreenInput(this);
    this.set = function(arg, val) {
        for (var i = 0; i < this.inputs.length; i++) {
            this.inputs[i][arg](val);
        }
    }
}

Input.prototype.setMenu = function(menu) { this.set("setMenu", menu); }
Input.prototype.setPlayerChooser = function(chooser) { this.set("setPlayerChooser", chooser); }
Input.prototype.setLevelChooser = function(chooser) { this.set("setLevelChooser", chooser); }
Input.prototype.setPlayers = function(players) { this.set("setPlayers", players); }

Input.prototype.update = function(now) {
    for (var i = 0; i < this.inputs.length; i++) {
        this.inputs[i].update(now);
    }
}

Input.prototype.do = function(obj, action, value) {
    if (obj[action]) obj[action](value);
}