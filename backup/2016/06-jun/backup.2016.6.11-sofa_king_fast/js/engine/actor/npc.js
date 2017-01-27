"use strict";

function NPC(player) {
    this.player = player;
    this.callback = "";
    this.action = "";
    this.key = null;
    this.val = null;
    this.startval = null;
    this.currentval = null;
    this.endval = null;
    this.busy = false;
}

NPC.prototype.doActionTimeout = function(action, start, end, when) {
    this.player.controller.lookStop();
    this.player.controller[action](start);
    var p = this.player;
    setTimeout(function() {
        p.controller[action](end);
    }, when);
}

NPC.prototype.doAction = function(action, args, key, val, callback) {
    if (this.action) return;
    this.busy = true;
    if (key && val) {
        this.callback = callback;
        this.action = action;
        this.key = key;
        this.val = val;
        this.startval = this.player.controller[key];
        this.currentval = this.startval;
        this.endval = this.startval + val;
    } else {
        this.player.controller[action](args);
        this.busy = false;
        if (callback) callback();
    }
}

NPC.prototype.update = function(delta) {
    var update = false;
    if (this.action) {
        if (this.key) {
            this.currentval = this.player.controller[this.key];
            if (this.currentval != this.endval) {
                if (this.startval <= this.endval) {
                    if (this.currentval <= this.endval) {
                        this.player.controller[this.action](this.val);
                        update = true;
                    } else {
                        this.player.controller[this.action](false);
                        this.player.controller[this.key] = this.endval;
                        this.player.controller.stop();
                        this.action = "";
                        this.busy = false;
                        if (this.callback) this.callback();
                    }
                } else if  (this.currentval >= this.endval) {
                    this.player.controller[this.action](this.val);
                    update = true;
                } else {
                    this.player.controller[this.action](false);
                    this.player.controller[this.key] = this.endval;
                    this.player.controller.stop();
                    this.action = "";
                    this.busy = false;
                    if (this.callback) this.callback();
                }
            }
        } else {
            this.player.controller[this.action](false);
            this.action = "";
            this.busy = false;
            if (this.callback) this.callback();
        }
    }
    return update;
}
