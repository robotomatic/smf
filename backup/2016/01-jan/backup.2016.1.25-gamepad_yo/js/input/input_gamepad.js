function GamepadInput(input) {
    this.input = input;
    var gi = this;
    window.addEventListener("gamepadconnected", function (e) { 
        // todo!
    });
    window.addEventListener("gamepaddisconnected", function (e) { 
        // todo!
    });

    this.jump = new Array();
    this.left = new Array();
    this.right = new Array();
}

GamepadInput.prototype.update = function(now, delta) {
    
    if (!this.players || !this.players.players) return;
    
    var pads = navigator.getGamepads();
    if (!pads || !pads.length) return;
    for (var i = 0; i < pads.length; i++) {
        
        if (!this.players.players[i]) continue;
        
        var pad = pads[i];
        if (!pad) continue;
    
        // todo: map this shit better...
        
        var buttons = pad.buttons;
        if (pad.buttons[2].pressed) {
            this.jump[i] = true;
            this.input.do(this.players.players[i], "jump", this.jump[i]);        
        } else {
            if (this.jump[i]) {
                this.jump[i] = false;
                this.input.do(this.players.players[i], "jump", this.jump[i]);        
            }
        }
        
        if (pad.buttons[14].pressed) {
            this.left[i] = true;
            this.input.do(this.players.players[i], "left", this.left[i]);        
        } else {
            if (this.left[i]) {
                this.left[i] = false;
                this.input.do(this.players.players[i], "left", this.left[i]);        
            }
        }

        if (pad.buttons[15].pressed) {
            this.right[i] = true;
            this.input.do(this.players.players[i], "right", this.right[i]);        
        } else {
            if (this.right[i]) {
                this.right[i] = false;
                this.input.do(this.players.players[i], "right", this.right[i]);        
            }
        }
    }
}

GamepadInput.prototype.setMenu = function(menu) {  }
GamepadInput.prototype.setPlayerChooser = function(chooser) {  }
GamepadInput.prototype.setLevelChooser = function(chooser) {  }
GamepadInput.prototype.setPlayers = function(players) { 
    this.players = players;
}



var applyDeadzone = function(number, threshold){
    percentage = (Math.abs(number) - threshold) / (1 - threshold);
    if(percentage < 0) percentage = 0;
    return percentage * (number > 0 ? 1 : -1);
}