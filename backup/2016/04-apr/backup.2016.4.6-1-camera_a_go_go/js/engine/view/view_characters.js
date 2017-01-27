"use strict";

function CharactersView(id, playernum, menubox, width, height, zoom) {
    this.view = new View(id, width, height, null, "menu-canvas");
    this.id = id;
    this.playernum = playernum;
    this.menubox = menubox;
    this.zoom = zoom ? zoom : 1;
    this.currentchar = this.playernum;
    this.view.renderdelay = 0;
};

CharactersView.prototype.view;
CharactersView.prototype.setLevel = function(level) { this.view.setLevel(level); }
CharactersView.prototype.addLayer = function(layer) { this.view.addLayer(layer); }
CharactersView.prototype.resizeText = function() { this.view.resizeText(); }
CharactersView.prototype.show = function() { this.view.show(); }
CharactersView.prototype.hide = function() { this.view.hide(); }

CharactersView.prototype.resize = function() { this.view.resize(); }
CharactersView.prototype.resizeUI = function() { }

CharactersView.prototype.update = function(now, stage) {
    this.view.update(now, stage);
}

CharactersView.prototype.render = function(now, stage) { 
    if (!this.view.render(now, stage)) return;
    clearRect(this.view.ctx_buffer, 0, 0, this.view.canvas_buffer.width, this.view.canvas_buffer.height);
    for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(now, stage, stage.level.layers[i]); 
    clearRect(this.view.ctx_render, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
    this.view.ctx_render.drawImage(this.view.canvas_buffer, 0, 0);
    this.updateUI(stage);
    this.view.dirty = false;
}

CharactersView.prototype.renderLayer = function(now, stage, layer) { 
    if (layer.draw === false) return;
    var layername = layer.name;
    if (layername != "players") return;
    
    var canvas = this.view.canvas_buffer;
    var ctx = this.view.ctx_buffer;
    
    var view = getViewWindow(canvas, stage.level.width, stage.level.height);

    var dx = (canvas.width - view.width) / 2;                 
    var dy = canvas.height - view.height;
    
    var scale = view.width / stage.level.width;
    
    var offy = this.playernum * (100 * scale);
    dy -= offy;
    
    
    this.renderPlayers(now, ctx, stage, dx, dy, scale); 
}

CharactersView.prototype.renderPlayers = function(now, ctx, stage, x, y, scale) { 
    this.renderPlayer(now, ctx, stage.players.players[this.playernum], x, y, scale);
    if (stage.players.players[this.playernum + 4]) this.renderPlayer(now, ctx, stage.players.players[this.playernum + 4], x, y, scale);
}

CharactersView.prototype.renderPlayer = function(now, ctx, player, x, y, scale) {
    this.view.renderPlayer(player, now, ctx, x, y, scale);
}

CharactersView.prototype.setMessage = function(message) { 
    this.view.setMessage(message);
}

CharactersView.prototype.updateUI = function(stage) {
    if (!this.view.updateUI()) return;
}