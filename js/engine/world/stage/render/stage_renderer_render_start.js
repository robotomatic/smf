"use strict";

function StageRendererStart(renderitems) {
    this.renderitems = renderitems;
    this.index = 0;
}

StageRendererStart.prototype.renderStart = function(mbr, window, graphics, camera, stage) {
    this.index = 0;
    this.getRenderItems(mbr, window, graphics, camera, stage);
}

StageRendererStart.prototype.getRenderItems = function(mbr, window, graphics, camera, stage) {
    var cp = window.getCenter();
    this.getRenderItemsStageItems(mbr, window, cp, graphics, stage);
    this.getRenderItemsStagePlayers(mbr, window, cp, graphics, stage);
}

StageRendererStart.prototype.getRenderItemsStageItems = function(mbr, window, cp, graphics, stage) {
    var t = stage.items.length;
    for (var i = 0; i < t; i++) {
        var item = stage.items[i];
        if (item.draw == false) continue;
        this.getRenderItemsStageLevelLayerItemsItem(mbr, window, cp, graphics, stage, item);
    }
}

StageRendererStart.prototype.getRenderItemsStageLevelLayerItemsItem = function(mbr, window, cp, graphics, stage, item) {
    var x = mbr.x;
    var y = mbr.y;
    var z = mbr.z;
    var scale = mbr.scale;
    var width = graphics.canvas.width;
    var height = graphics.canvas.height;
    var renderer = stage.level.itemrenderer;
    item.smooth();
    item.translate(mbr, width, height);
    item.item3D.createItem3D(renderer, mbr, stage.stagerenderer.flood);
    var showing = item.isVisible(window, mbr, 100);
    var iz = item.z;
    if (item.width == "100%") iz = item.z + item.depth;
    var d = this.getRenderItemsStageLevelLayerItemsItemCenter(mbr, cp, item, 0, 0, 0);
    if (isNaN(d)) d = 0;
    var itemmbr = item.getMbr();
    var id = item.id;
    var newitem = {
        type : "item",
        name : id,
        showing : showing,
        y : item.y,
        z : item.z + item.depth,
        distance: d,
        item : item,
        box : item.box,
        mbr : itemmbr,
        geometry : item.geometry
    }
    this.renderitems.all[this.index++] = newitem;
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
    var playermbr = player.getMbr();
    var showing = player.isVisible(window, mbr, 50);
    var d = this.getRenderItemsStageLevelLayerItemsItemCenter(mbr, cp, player.controller, 0, 0, -10);
    if (!showing || isNaN(d)) d = 0;
    var id = player.name + "-" + player.id;
    var newitem = {
        type : "player",
        name : id,
        showing : showing, 
        y : player.controller.y,
        z : player.controller.z,
        height : player.controller.height,
        distance: d,
        item : player,
        mbr : playermbr
    }
    this.renderitems.all[this.index++] = newitem;
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
    return round(pd);
}
