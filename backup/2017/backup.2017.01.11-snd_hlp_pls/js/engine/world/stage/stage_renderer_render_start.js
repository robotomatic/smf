"use strict";

function StageRendererStart(renderitems, itemcache) {
    this.renderitems = renderitems;
    this.itemcache = itemcache;
}

StageRendererStart.prototype.renderStart = function(mbr, window, graphics, stage, flood) {
    this.getRenderItems(mbr, window, graphics, stage, flood);
    this.getRenderItemsOverlap();
}

StageRendererStart.prototype.getRenderItems = function(mbr, window, graphics, stage, flood) {
    this.renderitems.all.length = 0;
    var cp = window.getCenter();
    this.getRenderItemsStageItems(mbr, window, cp, graphics, stage, flood);
    this.getRenderItemsStagePlayers(mbr, window, cp, graphics, stage, flood);
}

StageRendererStart.prototype.getRenderItemsStageItems = function(mbr, window, cp, graphics, stage, flood) {
    this.getRenderItemsStageLevelItems(mbr, window, cp, graphics, stage, stage.level, flood);
}

StageRendererStart.prototype.getRenderItemsStageLevelItems = function(mbr, window, cp, graphics, stage, level, flood) {
    var t = level.layers.length;
    for (var i = 0; i < t; i++) {
        var layer = level.layers[i];
        if (layer.draw === false) continue;
        this.getRenderItemsStageLevelLayerItems(mbr, window, cp, graphics, stage, layer, flood);
    }
}

StageRendererStart.prototype.getRenderItemsStageLevelLayerItems = function(mbr, window, cp, graphics, stage, layer, flood) {
    var t = layer.items.items.length;
    for (var i = 0; i < t; i++) {
        var item = layer.items.items[i];
        if (item.draw == false) continue;
        this.getRenderItemsStageLevelLayerItemsItem(mbr, window, cp, graphics, stage, item, flood);
    }
}

StageRendererStart.prototype.getRenderItemsStageLevelLayerItemsItem = function(mbr, window, cp, graphics, stage, item, flood) {
    var x = mbr.x;
    var y = mbr.y;
    var z = mbr.z;
    var scale = mbr.scale;
    var g = graphics["main"];
    var width = g.canvas.width;
    var height = g.canvas.height;
    var renderer = stage.level.itemrenderer;
    item.smooth();
    item.translate(mbr, width, height);
    var floodlevel = null;
    item.item3D.createItem3D(renderer, mbr, floodlevel);
    if (!item.isVisible(window, mbr)) return;
    var iz = item.z;
    if (item.width == "100%") iz = item.z + item.depth;
    var itemmbr = item.getMbr();
    var newitem = {
        type : "item",
        name : item.id,
        y : item.y,
        z : item.z + item.depth,
        item : item,
        box : item.box,
        mbr : itemmbr,
        geometry : item.geometry
    }
    this.renderitems.all.push(newitem);
}

StageRendererStart.prototype.getRenderItemsStagePlayers = function(mbr, window, cp, graphics, stage) {
    var players = stage.players;
    if (!players || !players.players) return;
    var t = players.players.length;
    for (var i = 0; i < t; i++) {
        var player = players.players[i];
        this.getRenderItemsStagePlayersPlayer(mbr, window, cp, graphics, player);
    }
}

StageRendererStart.prototype.getRenderItemsStagePlayersPlayer = function(mbr, window, cp, graphics, player) {
    // todo: see if player is visible
    player.smooth();
    player.translate(mbr, mbr.width, mbr.height);
    var box = new Rectangle(player.box.x, player.box.y, player.box.width, player.box.height);
    var pad = 50;
    box.x -= pad;
    box.width += pad * 2;
    var playermbr = player.getMbr();
    var newitem = {
        type : "player",
        name : player.name,
        y : player.controller.y,
        z : player.controller.z,
        item : player,
        box : box,
        mbr : playermbr
    }
    this.renderitems.all.push(newitem);
}



















StageRendererStart.prototype.getRenderItemsOverlap = function() {
    this.renderitems.overlap.hidden = new Array();
    this.renderitems.overlap.front_top.length = 0;
    this.renderitems.overlap.front_front.length = 0;
    this.renderitems.overlap.front_bottom.length = 0;
    this.renderitems.overlap.side_front.length = 0;
    this.renderitems.overlap.side_top.length = 0;
    this.renderitems.overlap.side_side.length = 0;
    this.renderitems.overlap.side_bottom.length = 0;
    this.renderitems.overlap.items = new Array();
    this.renderitems.overlap.overlaps = new Array();

    this.getRenderItemsHidden();
    
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var item1 = this.renderitems.all[i];
        if (!item1.geometry) continue;
        if (item1.item.width == "100%") continue;
        for (var ii = 0; ii < t; ii++) {
            var item2 = this.renderitems.all[ii];
            if (item1 == item2) continue;
            if (!item2.geometry) continue;
            if (item2.item.width == "100%") continue;
            
            if (item1.mbr.z + item1.mbr.depth > item2.mbr.z + item2.mbr.depth) continue;
            
            if (this.renderitems.overlap.hidden[item1.name]) continue;

            this.getRenderItemsOverlapFrontsTops(item1, item2);
            this.getRenderItemsOverlapFrontsFronts(item1, item2);
            this.getRenderItemsOverlapFrontsBottoms(item1, item2);
            
            this.getRenderItemsOverlapSidesFronts(item1, item2);
            
            this.getRenderItemsOverlapSidesTops(item1, item2);
            this.getRenderItemsOverlapSidesSides(item1, item2);
            
            this.getRenderItemsOverlapSidesBottoms(item1, item2);
        }
    }
}

StageRendererStart.prototype.getRenderItemsHidden = function() {
    var t = this.renderitems.all.length;
    for (var i = 0; i < t; i++) {
        var item1 = this.renderitems.all[i];
        if (!item1.item.geometry) continue;
        if (item1.item.width == "100%") continue;
        var hidden = 0;
        var geom1 = item1.item.geometry.projected;
        var tt = geom1.points.length;
        for (var ii = 0; ii < tt; ii++) {
            var point = geom1.points[ii];
            for (var iii = 0; iii < t; iii++) {
                var item2 = this.renderitems.all[iii];
                if (item1 == item2) continue;
                if (!item2.item.geometry) continue;
                if (item2.item.width == "100%") continue;
                if (item1.item.y >= item2.item.y + item2.item.height) continue;

                if (item1.item.geometry.tops.length && item2.item.geometry.tops.length) continue;


                if (item1.box.y + item1.box.height <= item2.box.y) continue;
                var geom2 = item2.item.geometry.projected;
                if (geom2.containsPoint(point)) {
                    hidden++;
                    break;
                }
            }
        }
        if (hidden == tt) {
            this.renderitems.overlap.hidden[item1.name] = item1;
        }
    }
}




StageRendererStart.prototype.getRenderItemsOverlapFrontsTops = function(item1, item2) {
    if (item1.box.z < 150) return;
    if (item1.item.x + item1.item.width < item2.item.x) return;
    if (item1.item.x > item2.item.x + item2.item.width) return;
    if (item1.mbr.y + item1.mbr.height <= item2.mbr.y) return;
    if (item1.mbr.z + item1.mbr.depth < item2.mbr.z) return;
    this.getRenderItemsOverlapOverlap(item1, item1.geometry.fronts, item2, item2.geometry.tops, "front-top", this.renderitems.overlap.front_top);
}

StageRendererStart.prototype.getRenderItemsOverlapFrontsFronts = function(item1, item2) {
    if (item1.box.z < 150) return;
    if (item1.box.z <= item2.box.z) return;

    this.getRenderItemsOverlapOverlap(item1, item1.geometry.fronts, item2, item2.geometry.fronts, "front-front", this.renderitems.overlap.front_front);
}

StageRendererStart.prototype.getRenderItemsOverlapFrontsBottoms = function(item1, item2) {
    if (item1.box.z <= item2.box.z) return;
    if (item1.z == item2.z) return;
    if (item1.y > item2.y) return;
    this.getRenderItemsOverlapOverlap(item1, item1.geometry.fronts, item2, item2.geometry.bottoms, "front-bottom", this.renderitems.overlap.front_bottom);
}


StageRendererStart.prototype.getRenderItemsOverlapSidesFronts = function(item1, item2) {
    
    // todo: you fucker
    return;
    
    
    if (item1.box.z + item1.box.depth < item2.box.z) return;
    //if (item1.box.y >= item2.box.y + item2.box.height) return;
    //if (item1.item.y + item1.item.height <= item2.item.y) return;
    
    if (!item1.geometry.sides.length || !item2.geometry.fronts.length) return;

    var side1 = item1.geometry.sides[0];
    var front2 = item2.geometry.fronts[0];
    var fronty = front2.points[2].y;

    if (side1.points[0].y >= fronty) return;
    
    if (item1.item.x + item1.item.width < item2.item.x) return;
    
    this.getRenderItemsOverlapOverlap(item1, item1.geometry.sides, item2, item2.geometry.fronts, "side-front", this.renderitems.overlap.side_front);
}

StageRendererStart.prototype.getRenderItemsOverlapSidesTops = function(item1, item2) {
    if (item1.mbr.z + item1.mbr.depth < item2.mbr.z) return;
    if (item1.mbr.y + item1.mbr.height <= item2.mbr.y) return;
    if (item1.box.y > item2.box.y + item2.box.height) return;
    this.getRenderItemsOverlapOverlap(item1, item1.geometry.sides, item2, item2.geometry.tops, "side-top", this.renderitems.overlap.side_top);
}

StageRendererStart.prototype.getRenderItemsOverlapSidesSides = function(item1, item2) {
    if (item1.mbr.x < item2.mbr.x || item1.mbr.x > item2.mbr.x + item2.mbr.width || item1.mbr.x + item1.mbr.width > item2.mbr.x + item2.mbr.width) return;
    if (item1.mbr.y >= item2.mbr.y + item2.mbr.height) return;
    this.getRenderItemsOverlapOverlap(item1, item1.geometry.sides, item2, item2.geometry.sides, "side-side", this.renderitems.overlap.side_side);
}

StageRendererStart.prototype.getRenderItemsOverlapSidesBottoms = function(item1, item2) {
    if (item1.mbr.y >= item2.mbr.y + item2.mbr.height) return;
    this.getRenderItemsOverlapOverlap(item1, item1.geometry.sides, item2, item2.geometry.bottoms, "side-bottom", this.renderitems.overlap.side_bottom);
}

StageRendererStart.prototype.getRenderItemsOverlapOverlap = function(item1, item1s, item2, item2s, overlaptype, overlaps) {
    var t = item1s.length;
    for (var i = 0; i < t; i++) {
        this.getRenderItemsOverlapOverlapItems(item1, item1s[i], item2, item2s, overlaptype, overlaps);
    }
}

StageRendererStart.prototype.getRenderItemsOverlapOverlapItems = function(item1, side1, item2, item2s, overlaptype, overlaps) {
    var points = side1.points;
    var t = points.length;
    for (var i = 0; i < t; i++) {
        var tt = item2s.length;
        for (var ii = 0; ii < tt; ii++) {
            var side2 = item2s[ii];
            if (side2.containsPoint(points[i])) {
                var overlap = {
                    type : overlaptype,
                    name : item1.name + "-::-" + item2.name, 
                    item1 : item1, 
                    item2 : item2,
                    side1 : side1,
                    side2 : side2,
                    point : points[i]
                }
                overlaps.push(overlap);
                var nid = overlaptype.replace("-", "_");
                if (debug_render[nid]) {
                    if (!this.renderitems.overlap.items[item1.name]) {
                        this.renderitems.overlap.items[item1.name] = {
                            item : item1, 
                            z : item1.z,
                            overlap : new Array()
                        }
                    }
                    if (!this.renderitems.overlap.items[item1.name].overlap[item2.name]) this.renderitems.overlap.items[item1.name].overlap[item2.name] = item2;
                    if (!this.renderitems.overlap.overlaps[item2.name]) this.renderitems.overlap.overlaps[item2.name] = item2;
                }
            }
        }
    }
}








