"use strict";

function WorldRendererStart(worldrenderer) {
    this.worldrenderer = worldrenderer;
    this.index = 0;
}

WorldRendererStart.prototype.renderStart = function(now, mbr, window, graphics, camera, world, debug) {
    this.index = 0;
    this.getRenderItems(mbr, window, graphics.graphics["main"], camera, world, debug);
}

WorldRendererStart.prototype.getRenderItems = function(mbr, window, graphics, camera, world, debug) {
    var cp = mbr.getCenter();
    this.getRenderItemsWorldItems(mbr, window, cp, graphics, camera, world, debug);
    this.getRenderItemsWorldPlayers(mbr, window, cp, graphics, camera, world, debug);
}

WorldRendererStart.prototype.getRenderItemsWorldItems = function(mbr, window, cp, graphics, camera, world, debug) {
    var t = world.renderitems.length;
    for (var i = 0; i < t; i++) {
        var item = world.renderitems[i];
        this.getRenderItemsWorldLevelLayerItemsItem(mbr, window, cp, graphics, camera, world, item, debug);
    }
}

WorldRendererStart.prototype.getRenderItemsWorldLevelLayerItemsItem = function(mbr, window, cp, graphics, camera, world, item, debug) {
    if (item.isHidden()) return;
    var itemtype = "item";
    var width = graphics.canvas.getWidth();
    var height = graphics.canvas.getHeight();
    var waterline = world.waterline;
    var wl = waterline.waterline;
    if (!world.worldrenderer.render.world) {
        waterline = null;
        wl = 0;
    }
    item.translate(mbr, width, height);
    item.underwater = false;
    if (waterline && waterline.flow && !item.waterline) {
        var fw = waterline.waterline;
        if (item.y >= fw) {
            item.underwater = true;
            item.showing = false;
        }
    }
    var showing = false;
    var d = 0;
    if (!item.underwater) {
        item.item3D.createItem3D(item, world, mbr, width, height, debug);

        if (!item.waterline && item.width != "100%") {
            if (world.worldrenderer.render.world) {
                waterline.updateItemWaterline(item);
            }
        }
        
        var viewpad = 100 * window.scale;
        showing = item.isVisible(window, viewpad);
        d = this.getRenderItemsWorldLevelLayerItemsItemCenter(mbr, cp, item, 0, 0, 0);
        if (isNaN(d)) d = 0;
    }
    if (item.waterline || item.width == "100%") {
        itemtype = "world";
        d += 10000;
    }
    var itemmbr = item.getMbr();
    
    var blur = "";
    if (camera.blur.blur) {
        var bd = this.getRenderItemsWorldLevelLayerItemsItemBlur(window, mbr, cp, itemmbr, 0, 0, 0);
        blur = camera.getBlurAmount(bd);
        if (item.width == "100%") blur = 100000;
    }
    var id = item.id;
    this.setRenderItemsRenderItem(itemtype, id, showing, item.box, d, item, itemmbr, blur);
}

WorldRendererStart.prototype.getRenderItemsWorldPlayers = function(mbr, window, cp, graphics, camera, world, debug) {
    var players = world.players;
    if (!players || !players.players) return;
    var t = players.players.length;
    for (var i = 0; i < t; i++) {
        var player = players.players[i];
        this.getRenderItemsWorldPlayersPlayer(world, mbr, window, cp, graphics, camera, player, debug);
    }
}

WorldRendererStart.prototype.getRenderItemsWorldPlayersPlayer = function(world, mbr, window, cp, graphics, camera, player, debug) {
    player.translate(mbr);
    var playermbr = player.getMbr();
    var viewpad = 50 * window.scale;
    var showing = player.isVisible(window, viewpad);
    var d = this.getRenderItemsWorldLevelLayerItemsItemCenter(mbr, cp, player.controller, 0, 0, -10);
    if (!showing || isNaN(d)) d = 0;
    var blur = "";
    if (camera.blur.blur) {
        var bd = this.getRenderItemsWorldLevelLayerItemsItemBlur(window, mbr, cp, playermbr, 0, 0, -10);
        blur = camera.getBlurAmount(bd);
    }
    var id = player.name + "-" + player.id;
    if (player.character.emitter) {
        this.getRenderItemsWorldPlayersPlayerParticleEmitter(id, mbr, showing, player.box, d + player.controller.depth + 20, player.character.emitter, playermbr, blur);
    }
    this.setRenderItemsRenderItem("player", id, showing, player.box, d, player, playermbr, blur);
}

WorldRendererStart.prototype.getRenderItemsWorldPlayersPlayerParticleEmitter = function(id, mbr, showing, box, d, emitter, playermbr, blur) {
    this.setRenderItemsRenderItem("particle", id + "_emitter", showing, box, d, emitter, playermbr, blur);
}

WorldRendererStart.prototype.getRenderItemsWorldLevelLayerItemsItemCenter = function(mbr, mbrcp, item, ox, oy, oz) {
    if (item.width == "100%") {
        return item.z + item.depth;
    }
    var ix = item.x + (item.width / 2) + ox;
    var iy = ((item.y * 2) + item.height) + oy;
    var iz = item.z + (item.depth) + oz;
    var pd = distance3D(ix, iy, iz, mbrcp.x, mbrcp.y, mbrcp.z);
    return round(pd);
}

WorldRendererStart.prototype.getRenderItemsWorldLevelLayerItemsItemBlur = function(window, mbr, mbrcp, item, ox, oy, oz) {
    var iz = item.z + (item.depth) + oz;
    var pd = iz - mbrcp.z;
    return round(pd);
}

WorldRendererStart.prototype.setRenderItemsRenderItem = function(type, id, showing, box, distance, item, mbr, blur) {
    var index = this.index++;
    if (this.worldrenderer.renderitems.keys[id]) {
        var newitem = this.worldrenderer.renderitems.keys[id];
        newitem.index = index;
        newitem.showing = showing;
        newitem.x = box.x;
        newitem.y = box.y;
        newitem.z = box.z;
        newitem.width = box.width;
        newitem.height = box.height;
        newitem.depth = box.depth;
        newitem.distance = distance;
        newitem.blur = blur;
        newitem.box.copy(box);
    } else {
        var newitem = {
            type : type,
            name : id,
            index : index,
            showing : showing, 
            x : box.x,
            y : box.y,
            z : box.z,
            width : box.width,
            height : box.height,
            depth : box.depth,
            box : new Rectangle(),
            distance: distance,
            item : item,
            mbr : mbr,
            blur : blur
        }
        newitem.box.copy(box);
        this.worldrenderer.renderitems.keys[id] = newitem;
    }
    this.worldrenderer.renderitems.all[index] = newitem;
}

