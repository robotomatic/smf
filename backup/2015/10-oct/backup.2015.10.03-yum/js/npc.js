NPC = function(player) {
    this.player = player;
    this.callback = "";
    this.action = "";
    this.key = null;
    this.val = null;
    this.startval = null;
    this.currentval = null;
    this.endval = null;
}

NPC.prototype.doAction = function(action, args, key, val, callback) {
    if (this.action) return;
    if (key && val) {
        this.callback = callback;
        this.action = action;
        this.key = key;
        this.val = val;
        this.startval = this.player[key];
        this.currentval = this.startval;
        this.endval = this.startval + val;
    } else {
        this.player[action](args);
        if (callback) callback();
    }
}

NPC.prototype.update = function(delta) {
    var update = false;
    if (this.action) {
        this.currentval = this.player[this.key];
        if (this.currentval != this.endval) {
            if (this.startval <= this.endval) {
                if (this.currentval <= this.endval) {
                    this.player[this.action](this.val);
                    update = true;
                } else {
                    this.player[this.action](false);
                    this.player[this.key] = this.endval;
                    this.player.stop();
                    this.action = "";
                    if (this.callback) this.callback();
                }
            } else if  (this.currentval >= this.endval) {
                this.player[this.action](this.val);
                update = true;
            } else {
                this.player[this.action](false);
                this.player[this.key] = this.endval;
                this.player.stop();
                this.action = "";
                if (this.callback) this.callback();
            }
        }
    }
    return update;
}
