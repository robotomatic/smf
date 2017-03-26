"use strict";

function WorldRendererStart(renderitems) {
    this.renderitems = renderitems;
    this.index = 0;
}

WorldRendererStart.prototype.renderStart = function(mbr, window, graphics, camera, world, debug) {
    this.index = 0;
    this.getRenderItems(mbr, window, graphics, camera, world, debug);
}

WorldRendererStart.prototype.getRenderItems = function(mbr, window, graphics, camera, world, debug) {
    var cp = window.getCenter();
    this.getRenderItemsWorldItems(mbr, window, cp, graphics, world, debug);
    this.getRenderItemsWorldPlayers(mbr, window, cp, graphics, world, debug);
}

WorldRendererStart.prototype.getRenderItemsWorldItems = function(mbr, window, cp, graphics, world, debug) {
    var t = world.items.length;
    for (var i = 0; i < t; i++) {
        var item = world.items[i];
        if (item.isbounds) continue;
        this.getRenderItemsWorldLevelLayerItemsItem(mbr, window, cp, graphics, world, item, debug);
    }
}

WorldRendererStart.prototype.getRenderItemsWorldLevelLayerItemsItem = function(mbr, window, cp, graphics, world, item, debug) {
    var width = graphics.canvas.getWidth();
    var height = graphics.canvas.getHeight();
    item.smooth();
    item.translate(mbr, width, height);
    item.item3D.createItem3D(item, world.worldrenderer.itemrenderer, mbr, width, height, world.worldrenderer.waterline, debug);
    var showing = item.isVisible(window, mbr, 100);
    if (world.worldrenderer.waterline.flow && item.y >= world.worldrenderer.waterline) showing = false;
    var d = this.getRenderItemsWorldLevelLayerItemsItemCenter(mbr, cp, item, 0, 0, 0);
    if (isNaN(d)) d = 0;
    var id = item.id;
    
    if (this.renderitems.keys[id]) {
        var newitem = this.renderitems.keys[id];
        newitem.showing = showing;
        newitem.x = item.x;
        newitem.y = item.y;
        newitem.z = item.z + item.depth;
        newitem.width = item.width;
        newitem.height = item.height;
        newitem.depth = item.depth;
        newitem.distance = d;
    } else {
        var newitem = {
            type : "item",
            name : id,
            showing : showing,
            x : item.x,
            y : item.y,
            z : item.z + item.depth,
            width : item.width,
            height : item.height,
            depth : item.depth,
            distance : d,
            item : item,
            box : item.box,
            mbr : item.getMbr(),
            geometry : item.geometry
        }
        this.renderitems.all[this.index++] = newitem;
        this.renderitems.keys[id] = newitem;
    }
}

WorldRendererStart.prototype.getRenderItemsWorldPlayers = function(mbr, window, cp, graphics, world, debug) {
    var players = world.players;
    if (!players || !players.players) return;
    var t = players.players.length;
    for (var i = 0; i < t; i++) {
        var player = players.players[i];
        this.getRenderItemsWorldPlayersPlayer(mbr, window, cp, graphics, player, debug);
    }
}

WorldRendererStart.prototype.getRenderItemsWorldPlayersPlayer = function(mbr, window, cp, graphics, player, debug) {
    player.smooth();
    player.translate(mbr, mbr.width, mbr.height);
    var playermbr = player.getMbr();
    var showing = player.isVisible(window, mbr, 50);
    var d = this.getRenderItemsWorldLevelLayerItemsItemCenter(mbr, cp, player.controller, 0, 0, -10);
    if (!showing || isNaN(d)) d = 0;
    var id = player.name + "-" + player.id;
    
    if (this.renderitems.keys[id]) {
        var newitem = this.renderitems.keys[id];
        newitem.showing = showing;
        newitem.x = player.controller.x;
        newitem.y = player.controller.y;
        newitem.z = player.controller.z;
        newitem.width = player.controller.width;
        newitem.height = player.controller.height;
        newitem.depth = player.controller.depth;
        newitem.distance = d;
    } else {
        var newitem = {
            type : "player",
            name : id,
            showing : showing, 
            x : player.controller.x,
            y : player.controller.y,
            z : player.controller.z,
            width : player.controller.width,
            height : player.controller.height,
            depth : player.controller.depth,
            distance: d,
            item : player,
            mbr : playermbr
        }
        this.renderitems.all[this.index++] = newitem;
        this.renderitems.keys[id] = newitem;
    }
}

WorldRendererStart.prototype.getRenderItemsWorldLevelLayerItemsItemCenter = function(mbr, cp, item, ox, oy, oz) {
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
