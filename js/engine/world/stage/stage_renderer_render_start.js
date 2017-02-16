"use strict";

function StageRendererStart(renderitems, itemcache) {
    this.renderitems = renderitems;
    this.itemcache = itemcache;
}

StageRendererStart.prototype.renderStart = function(mbr, window, graphics, camera, stage, flood) {
    this.getRenderItems(mbr, window, graphics, camera, stage, flood);
}

StageRendererStart.prototype.getRenderItems = function(mbr, window, graphics, camera, stage, flood) {
    this.renderitems.all.length = 0;
    this.renderitems.hsr.length = 0;
    this.renderitems.geometry.length = 0;
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

    this.renderitems.hsr.push(item);
    
    if (!item.isVisible(window, mbr, 100)) {
        item.showing = false;
        return;
    }
    item.showing = true;
    
    var iz = item.z;
    if (item.width == "100%") iz = item.z + item.depth;
 
    var id = this.getRenderItemsStageLevelLayerItemsItemCenter(mbr, cp, item, 0, 0, 0);
    
    var itemmbr = item.getMbr();
    var newitem = {
        type : "item",
        name : item.id,
        y : item.y,
        z : item.z + item.depth,
        distance: id,
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
    player.smooth();
    player.translate(mbr, mbr.width, mbr.height);
    var box = new Rectangle(player.box.x, player.box.y, player.box.width, player.box.height);
    var pad = 50;
    box.x -= pad;
    box.width += pad * 2;
    var playermbr = player.getMbr();

    if (!player.isVisible(window, mbr, 50)) {
        player.showing = false;
        return;
    }
    player.showing = true;
    
    var id = this.getRenderItemsStageLevelLayerItemsItemCenter(mbr, cp, player.controller, 0, 0, -10);
    
    var newitem = {
        type : "player",
        name : player.name,
        y : player.controller.y,
        z : player.controller.z,
        distance: id,
        item : player,
        box : box,
        mbr : playermbr
    }
    this.renderitems.all.push(newitem);
}


StageRendererStart.prototype.getRenderItemsStageLevelLayerItemsItemCenter = function(mbr, cp, item, ox, oy, oz) {
    
    if (item.width == "100%") {
        return item.z + item.depth;
    }

    var mbrcp = mbr.getCenter();

    var ix = item.x + (item.width / 2) + ox;
    var iy = item.y + oy;
    var iz = item.z + (item.depth) + oz;
    var pd = distance3D(ix, iy, iz, mbrcp.x, mbrcp.y, mbrcp.z);
    
    return pd;
}
