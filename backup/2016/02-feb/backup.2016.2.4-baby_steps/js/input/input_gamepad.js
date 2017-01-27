function GamepadInputMenuBindings() {
    this.bindings = new Array();
    this.bindings[0] = { item : "buttons", element : 8, test : "button", action : "startGame" };
    this.bindings[1] = { item : "buttons", element : 9, test : "button", action : "startGame" };
    this.bindings[2] = { item : "buttons", element : 0, test : "button", action : "startGame" };
}

function GamepadInputPlayerChooserBindings() {
    this.bindings = new Array();
    this.bindings[0] = { item : "buttons", element : 8, test : "button", action : "startGame" };
    this.bindings[1] = { item : "buttons", element : 9, test : "button", action : "startGame" };
    this.bindings[2] = { item : "buttons", element : 0, test : "button", action : "startGame" };
}

function GamepadInputLevelChooserBindings() {
    this.bindings = new Array();
    this.bindings[0] = { item : "buttons", element : 8, test : "button", action : "startGame" };
    this.bindings[1] = { item : "buttons", element : 9, test : "button", action : "startGame" };
    this.bindings[2] = { item : "buttons", element : 0, test : "button", action : "startGame" };
}

function GamepadInputPlayerBindings() {
    this.bindings = new Array();
    this.bindings[0] = { item : "buttons", element : 8, test : "button", action : "startGame" };
    this.bindings[1] = { item : "buttons", element : 9, test : "button", action : "startGame" };
    
    this.bindings[2] = { item : "buttons", element : 0, test : "button", action : "jump", live : true };
    this.bindings[3] = { item : "buttons", element : 14, test : "button", action : "left", live : true };
    this.bindings[4] = { item : "buttons", element : 15, test : "button", action : "right", live : true };

    this.bindings[5] = { item : "axes", element : 0, test : "stick", value : -1, action : "left", live : true };
    this.bindings[6] = { item : "axes", element : 0, test : "stick", value : 1, action : "right", live : true };
}

function GamepadInput(input) {
    this.players = null;
    this.bindings = new Array();
    this.actions = null;
    this.input = input;
    var gi = this;
    window.addEventListener("gamepadconnected", function (e) {
        gi.connectGamepad(e.gamepad);
    });
    window.addEventListener("gamepaddisconnected", function (e) { 
        gi.disconnectGamepad(e.gamepad);
    });
}

GamepadInput.prototype.connectGamepad = function(gamepad) {
    this.updatePlayers();
}

GamepadInput.prototype.disconnectGamepad = function(gamepad) {
    var index = null;
    for (var i =0 ; i < this.bindings.length; i++) {
        if (this.bindings[i][0] && this.bindings[i][0].padid == gamepad.id) {
            index = i;
            break;
        }
    }
    if (index) {
        this.log("Disonnected", i, gamepad.id, this.bindings[index].obj);
        this.bindings[index] = null;
        this.actions[index] = null;
    } else {
        this.log("Unknown Disconnect",  gamepad.index, gamepad.id, null);
    }
}

GamepadInput.prototype.update = function(now, delta) {
    if (!this.bindings || !this.bindings.length) return;
    var pads = navigator.getGamepads();
    if (!pads || !pads.length) return;
    for (var i = 0; i < pads.length; i++) {
        var pad = pads[i];
        if (!pad) continue;
        this.udpatePad(now, delta, pad, i);
    }
}

GamepadInput.prototype.udpatePad = function(now, delta, pad, index) {
    if (!this.bindings || !this.bindings[index]) return;
    for (var i = 0; i < this.bindings[index].length; i++) {
        var binding = this.bindings[index][i].binding;
        var binditem = binding.item;
        var bindelement = binding.element;
        
        if (!pad[binditem] || !pad[binditem][bindelement]) continue;
        var paditem = pad[binditem][bindelement];
        
        var bindtest = binding.test;
        var padval = this[bindtest](paditem, binding.value);
        
        var bindaction = binding.action;
        var bindobj = this.bindings[index][i].obj;

        if (binding.live) {
            var actionname = binditem + "_" + bindelement + "_" + bindaction;
            if (this.actions[index] && (padval && !this.actions[index][actionname]) || (!padval && this.actions[index][actionname])) {
                this.input.do(bindobj, bindaction, padval);                        
            }
            this.actions[index][actionname] = (padval == 0 || padval == false) ? false : true;
        } else {
            if (padval) this.input.do(bindobj, bindaction, padval);
            else if (binding.invert) this.input.do(bindobj, bindaction, !padval);
        } 
    }
}

GamepadInput.prototype.button = function(pad) { 
    return pad.pressed;
}

GamepadInput.prototype.dpad = function(pad) { 
    return pad.pressed;
}

GamepadInput.prototype.stick = function(pad, value) { 
    return this.applyDeadzone(pad, 0.25) == value;
}

GamepadInput.prototype.applyDeadzone = function(number, threshold){
    percentage = (Math.abs(number) - threshold) / (1 - threshold);
    if(percentage < 0) percentage = 0;
    return percentage * (number > 0 ? 1 : -1);
}

GamepadInput.prototype.bindGamepads = function(obj, bindings) { 
    this.actions = null;
    this.bindings.length = 0;
    var pads = navigator.getGamepads();
    for (var i = 0; i < pads.length; i++) if (pads[i]) this.bind(obj, i, pads[i].id, bindings);
} 

GamepadInput.prototype.bind = function(obj, index, padid, bindings) { 
    this.bindings[index] = new Array();
    for (var i = 0; i < bindings.bindings.length; i++) this.mapButton(obj, index, padid, bindings.bindings[i]); 
}

GamepadInput.prototype.mapButton = function(obj, index, padid, binding) {
    this.bindings[index][this.bindings[index].length] = { padid : padid, obj : obj, binding : binding };
}

GamepadInput.prototype.setMenu = function(menu) { this.bindGamepads(menu, new GamepadInputMenuBindings()); }
GamepadInput.prototype.setPlayerChooser = function(chooser) { this.bindGamepads(chooser, new GamepadInputPlayerChooserBindings()); }
GamepadInput.prototype.setLevelChooser = function(chooser) { this.bindGamepads(chooser, new GamepadInputLevelChooserBindings()); }

GamepadInput.prototype.setPlayers = function(players) { 
    this.players = players;
    this.actions = new Array();
    this.bindings.length = 0;
    this.updatePlayers();
}

GamepadInput.prototype.updatePlayers = function() { 
    var pads = navigator.getGamepads();
    for (var i = 0; i < this.players.players.length; i++) {
        if (pads[i] && !this.bindings[i]) {
            this.bind(this.players.players[i], i, pads[i].id, new GamepadInputPlayerBindings()); 
            this.actions[i] = new Array();
            this.log("Connected", i, pads[i].id, this.players.players[i]);
        }
    }
}
                     
GamepadInput.prototype.log = function(action, index, id, player) { 
    console.log("Controller " + action + ": index = " + index + ", id = " + id + ", player = " + ((player) ? player.name : "???"));
}

                     