"use strict";

function KeyboardInputMenuKeyBindings() {
    this.bindings = new Array();
    this.bindings[0] = { 13 : "startGame", 32 : "startGame" };
}

function KeyboardInputPlayerChooserKeyBindings() {
    this.bindings = new Array();
    this.bindings[0] = { 13 : "startGame", 32 : "startGame" };
}

function KeyboardInputLevelChooserKeyBindings() {
    this.bindings = new Array();
    this.bindings[0] = { 13 : "startGame", 32 : "startGame" };
}

function KeyboardInputPlayerKeyBindings() {
    this.bindings = new Array();
    this.bindings[0] = { 87: "jump", 65: "left", 68: "right" };
    this.bindings[1] = { 38: "jump", 37: "left", 39: "right" };
    this.bindings[2] = { 104: "jump", 100: "left", 102: "right" };
    this.bindings[3] = { 80: "jump", 76: "left", 222: "right" };
}

function KeyboardInput(input) {
    this.keys = new Array();
    this.input = input;
    let ki = this;
    document.body.addEventListener("keydown", function (e) { 
        ki.keyEvent(e.keyCode, true); 
        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });
    document.body.addEventListener("keyup", function (e) { 
        ki.keyEvent(e.keyCode, false);
        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });
}

KeyboardInput.prototype.update = function(now, delta) { }

KeyboardInput.prototype.bind = function(obj, bindings) {
    this.keys = new Array();
    for (let i = 0; i < bindings.bindings.length; i++) this.mapKeys(obj, bindings.bindings[i]);
}

KeyboardInput.prototype.bindList = function(list, bindings) {
    this.keys = new Array();
    for (let i = 0; i < list.length; i++) this.mapKeys(list[i], bindings.bindings[i]);
}

KeyboardInput.prototype.mapKeys = function(obj, keys) { for (let key in keys) this.mapKey(key, obj, keys[key]); }
KeyboardInput.prototype.mapKey = function(key, obj, action) { this.keys[key] = new Array(obj, action) };    
KeyboardInput.prototype.keyEvent = function(key, val) { if (this.keys[key]) this.input.do(this.keys[key][0], this.keys[key][1], val); }

KeyboardInput.prototype.setMenu = function(menu) { this.bind(menu, new KeyboardInputMenuKeyBindings()); }
KeyboardInput.prototype.setPlayerChooser = function(chooser) { this.bind(chooser, new KeyboardInputPlayerChooserKeyBindings()); }
KeyboardInput.prototype.setLevelChooser = function(chooser) { this.bind(chooser, new KeyboardInputLevelChooserKeyBindings()); }
KeyboardInput.prototype.setPlayers = function(players) { 
    if (players.players.length == 1) this.bind(players.players[0], new KeyboardInputPlayerKeyBindings()); 
    else this.bindList(players.players, new KeyboardInputPlayerKeyBindings()); 
}

