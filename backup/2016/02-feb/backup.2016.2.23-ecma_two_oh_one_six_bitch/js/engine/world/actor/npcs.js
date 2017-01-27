"use strict";

function NPCs() {
    this.npcs = new Array();
    this.callback = "";
}

NPCs.prototype.addNPC = function(npc) { this.npcs.push(npc); }

NPCs.prototype.doAction = function(action, args, key, val, callback, playercallback) { 
    this.callback = callback;
    for (let i = 0; i < this.npcs.length; i++)  {
        this.npcs[i].doAction(action, args, key, val, playercallback);
    }
}

NPCs.prototype.update = function(step) {
    let docallback = true;
    for (let i = 0; i < this.npcs.length; i++) {
        if (this.npcs[i] && this.npcs[i].action) {
            let update = this.npcs[i].update(step);
            if (update) docallback = false;
        }
    }
    if (docallback && this.callback) {
        this.callback();
        this.callback = "";
    }
}