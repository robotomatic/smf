"use strict";

function Items() {
    this.items = new Array();
}

Items.prototype.loadJson = function(items, collide) {
    for (var item in items) {
        var it = new Item();
        it.loadJson(items[item]);
        if (it.collide != false && it.collide != "top") {
            it.collide = collide;
        }
        this.addItem(item, it);
    }
}

Items.prototype.addItem = function(key, item) { 
    this.items[key] = item;
}


Items.prototype.update = function(now, delta) { 
    if (!this.items.length) return;
    var t = this.items.length;
    for (var i = 0; i < t; i++) {
        this.items[i].update(now, delta);
    }
}