"use strict";

function Input() {
    
    
    this.inputs = new Array();
    
    this.inputs[0] = new KeyboardInput(this);
    this.inputs[1] = new GamepadInput(this);
    this.inputs[2] = new ScreenInput(this);
    
    this.set = function(arg, val) {
        for (var i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i]) this.inputs[i][arg](val);
        }
    }
}


// todo: this needs to be generic. set controller and get actions from it. 
// todo: controller needs to be genericized as well so there is only 1 with config
// todo: inputs need to enumerate so they can be assigned instead of the other way around...


Input.prototype.setMenu = function(menu) { this.set("setMenu", menu); }

Input.prototype.setPlayers = function(players) { this.set("setPlayers", players); }

Input.prototype.update = function(now) {
    for (var i = 0; i < this.inputs.length; i++) {
        this.inputs[i].update(now);
    }
}

Input.prototype.do = function(obj, action, value) {
    if (obj[action]) obj[action](value);
}