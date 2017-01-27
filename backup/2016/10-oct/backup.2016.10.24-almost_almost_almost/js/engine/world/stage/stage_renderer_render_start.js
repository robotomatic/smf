"use strict";

function StageRendererStart(renderitems) {
    this.renderitems = renderitems;
}

StageRendererStart.prototype.renderStart = function(mbr, window, graphics, stage) {
    this.getAllItems(mbr, window, graphics, stage);
    this.sortItemsVertical(window);
}

StageRendererStart.prototype.getAllItems = function(mbr, window, graphics, stage) {
    this.renderitems.all.length = 0;
    this.renderitems.first.length = 0;
    this.getAllItemsItems(mbr, window, graphics, stage.level);
    this.getAllItemsPlayers(mbr, window, graphics, stage);
}

StageRendererStart.prototype.getAllItemsItems = function(mbr, window, graphics, level) {
    var g = graphics["main"];
    var width = g.canvas.width;
    var height = g.canvas.height;
    var t = level.layers.length;
    for (var i = 0; i < t; i++) {
        var layer = level.layers[i];
        if (layer.draw === false) continue;
        var tt = layer.items.items.length;
        for (var ii = 0; ii < tt; ii++) {
            var it = layer.items.items[ii];
            if (it.draw == false) continue;
            
            it.smooth();
            it.translate(mbr, width, height);
            
            // todo: can test for view here?
            
            if (it.width == "100%") {
                this.renderitems.first.push(it);
                continue;
            }
            
            var itmbr = it.box;
            var ni = {
                type : "item",
                x : itmbr.x,
                y : itmbr.y,
                z : itmbr.z,
                width : itmbr.width,
                height : itmbr.height,
                depth : itmbr.depth,
                zdepth : round(it.z + it.depth),
                real_y : it.y,
                mbr : it.getMbr(),
                box : itmbr,
                item: it
            }
            this.renderitems.all[this.renderitems.all.length] = ni;
        }
    }
}

StageRendererStart.prototype.getAllItemsPlayers = function(mbr, window, graphics, stage) {
    var players = stage.players;
    if (players && players.players) {
        var pt = players.players.length;
        for (var pi = 0; pi < pt; pi++) {
            var rp = players.players[pi];
            var rpb = rp.box;
 
            // todo: add smooth and translate here?
            // todo: can test for view here?
            
            var np = {
                type : "player",
                x : rpb.x,
                y : rpb.y,
                z : rpb.z,
                width : rpb.width,
                height : rpb.height,
                depth : rpb.depth,
                zdepth : round(rp.controller.z + rp.controller.depth),
                real_y : rp.controller.y,
                mbr : rp.getMbr(),
                box : rpb,
                item : rp
            }
            this.renderitems.all[this.renderitems.all.length] = np;
            this.renderitems.centerbottom = rp.controller.groundpoint.y;
        }
    }
}

StageRendererStart.prototype.sortItemsVertical = function(window) {
    var cp = window.getCenter();
    this.renderitems.above.all.length = 0;
    this.renderitems.center.all.length = 0;
    this.renderitems.below.all.length = 0;
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var item = this.renderitems.all[i];
        var side = "center";
        if (item.real_y > this.renderitems.centerbottom) side = "below";
        else if (item.y + item.height < cp.y) side = "above";
        this.renderitems[side].all[this.renderitems[side].all.length] = item;
    }
    this.sortItemsVerticalZ(this.renderitems.above, cp);
    this.sortItemsVerticalZ(this.renderitems.center, cp);
    this.sortItemsVerticalYZ(this.renderitems.center.z, cp);
    this.sortItemsVerticalZ(this.renderitems.below, cp);
}

StageRendererStart.prototype.sortItemsVerticalZ = function(items, cp) {
    items.y = new Array();
    items.z = new Array();
    var t = items.all.length;
    for (var i = 0; i < t; i++) {
        var item = items.all[i];
        var y = item.real_y;
        
        if (isNaN(y)) {
            console.log("YYYYYYY");
        }
        
        var key = round(y);
        if (!items.y[key]) {
            items.y[key] = {
                z : new Array()
            }
        }
        var z = item.z + item.depth;
        
        if (isNaN(z)) {
            console.log("ZZZZZZZ");
        }
        
        var zkey = round(z);
        if (!items.y[key].z[zkey]) {
            items.y[key].z[zkey] =  new Array()
        }
        items.y[key].z[zkey][items.y[key].z[zkey].length] = item;

        if (!items.z[zkey]) {
            items.z[zkey] =  new Array()
        }
        items.z[zkey][items.z[zkey].length] = item;
    }
    this.sortItemsVerticalY(items.y, cp);
}

StageRendererStart.prototype.sortItemsVerticalY = function(items, cp) {
    var keys = Object.keys(items);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var item = items[keys[i]];
        this.sortItemsVerticalYZ(item.z, cp);
    }
}

StageRendererStart.prototype.sortItemsVerticalYZ = function(items, cp) {
    var zkeys = Object.keys(items);
    var tt = zkeys.length;
    for (var ii = 0; ii < tt; ii++) {
        var itemitems = items[zkeys[ii]];
        this.sortItemsVerticalYZHorizontal(itemitems, cp)
    }
}

StageRendererStart.prototype.sortItemsVerticalYZHorizontal = function(items, cp) {
    items.left = new Array();
    items.center = new Array();
    items.right = new Array();
    var keys = Object.keys(items);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var item = items[keys[i]];
        var side = "center";
        if (item.x > cp.x) side = "right";
        else if (item.x + item.width < cp.x) side = "left";
        items[side][items[side].length] = item;
    }
}