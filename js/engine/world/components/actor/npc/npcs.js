"use strict";

function NPCs() {
    this.npcs = new Array();
    this.callback = "";
}

NPCs.prototype.addNPC = function(npc) { this.npcs.push(npc); }

NPCs.prototype.doAction = function(action, args, key, val, callback, playercallback) { 
    this.callback = callback;
    for (var i = 0; i < this.npcs.length; i++)  {
        this.npcs[i].doAction(action, args, key, val, playercallback);
    }
}

NPCs.prototype.update = function(when, delta) {
    var docallback = true;
    for (var i = 0; i < this.npcs.length; i++) {
        if (this.npcs[i] && this.npcs[i].action) {
            var update = this.npcs[i].update(when, delta);
            if (update) docallback = false;
        }
    }
    if (docallback && this.callback) {
        this.callback();
        this.callback = "";
    }
}