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
    this.paused = false;
    this.timeout = {
        timeout : false,
        start : 0,
        end : 0,
        action : "",
        val : null
    }
        
}

NPC.prototype.pause = function(when) {
    this.paused = true;
}

NPC.prototype.resume = function(when) {
    this.paused = false;
}

    
NPC.prototype.reset = function(when) {
    this.action = null;
    this.callback = null;
    this.busy = false;
    this.timeout.timeout = false;
}

NPC.prototype.stop = function() {
    if (this.timeout.timeout) {
        this.player.controller[this.timeout.action](this.timeout.val);
    }
    if (this.action) {
        this.player.controller[this.action](false);
    }
    this.reset();
}


NPC.prototype.doActionTimeout = function(action, start, end, starttime, duration) {

    if (this.timeout.timeout) {
        this.player.controller[this.timeout.action](this.timeout.val);
    }

    this.player.controller.stop();
    this.player.controller.lookStop();
    this.player.controller[action](start);
    var p = this.player;
    
    this.timeout.timeout = true;
    this.timeout.start = starttime;
    this.timeout.end = starttime + duration;
    this.timeout.action = action;
    this.timeout.val = end;

    this.busy = true;
    this.update(starttime, 0);
}

NPC.prototype.doAction = function(action, args, key, val, callback) {
    if (this.action) return;
    this.timeout.timeout = false;
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

NPC.prototype.update = function(when, delta, paused) {

    if (this.paused || paused) return;
    
    if (this.timeout.timeout) {
        return this.updateTimeout(when, delta);
    }
    
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


NPC.prototype.updateTimeout = function(when, delta) {
    if (!this.timeout.timeout) return false;
    if (when >= this.timeout.end) {
        this.player.controller[this.timeout.action](this.timeout.val);
        this.timeout.timeout = false;
        this.busy = false;
        return false;
    }
    return true;
}
