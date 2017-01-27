"use strict";

function MenuView(id, width, height, scale) {
    this.view = new View(id, null, null, scale);

    this.viewpad = 5;
    

    this.camera = new PartyViewCamera();

    this.drawleveldebug = false;
    this.drawplayerdebug = false;
    this.drawnpcdebug = false;
    
    this.lastp = null;
    
    this.ready = false;
    
    var controller = this;
    this.view.canvas_render.onclick = function() {
        
        window.location.hash="#menu-player";
        
    }

    this.viewtop = 250;
    
    this.viewwindow = new Rectangle();
    this.mbr = new Rectangle();
    this.transmbr = new Rectangle();
    this.levelbox = new Rectangle();
}

MenuView.prototype.view;
MenuView.prototype.setLevel = function(level) { this.view.setLevel(level); }
MenuView.prototype.addLayer = function(layer) { this.view.addLayer(layer); }
MenuView.prototype.resizeText = function() { this.view.resizeText(); }
MenuView.prototype.show = function() { 
    this.resizeUI();
    this.view.show(); 
}
MenuView.prototype.hide = function() { this.view.hide(); }

MenuView.prototype.resize = function() { 
    this.view.resize();
    this.resizeUI();
}
MenuView.prototype.resizeUI = function() { this.view.resizeUI(); }

MenuView.prototype.update = function(now, stage) {

    this.view.update(now, stage);
    
    if (!stage.players || !stage.players.players.length) return;
    
    for (var i = 0; i < stage.players.players.length; i++) {
        
        if (stage.players.players[i].x < 20 && stage.players.players[i].move_left) stage.players.players[i].left(false);
        else if (stage.players.players[i].x > stage.level.width - (stage.players.players[i].width + 20) && stage.players.players[i].move_right) stage.players.players[i].right(false);

        if (!stage.players.players[i].paused && !stage.players.players[i].move_left && !stage.players.players[i].move_right && stage.players.players[i].grounded) {
            var dir = random(0, 8);
            if (dir == 0) {
                if (stage.players.players[i].x > 20) {
                    stage.players.players[i].lookStop();
                    stage.players.players[i].left(true);
                    stage.players.players[i].timeout("left", false, random(1000, 3000));
                }
            } else if (dir == 1) {
                if (stage.players.players[i].x < stage.level.width - (stage.players.players[i].width + 20)) {
                    stage.players.players[i].lookStop();
                    stage.players.players[i].right(true);
                    stage.players.players[i].timeout("right", false, random(1000, 3000));
                }
            } else {
                if (!stage.players.players[i].falling) {
                    var safe = true;
                    for (var ii = 0; ii < stage.players.players.length; ii++) {
                        if (ii == i) continue;
                        if (stage.players.players[ii].paused) {
                            var d = Math.abs(stage.players.players[ii].x - stage.players.players[i].x);
                            if (d < 20) {
                                safe = false;
                                break;
                            }
                        }
                    }
                    if (safe) {
                        stage.players.players[i].pause(true);
                        stage.players.players[i].timeout("pause", false, random(1000, 3000));
                    } else {
                        var dir2 = random(0, 1);
                        if (dir2 == 0) {
                            if (stage.players.players[i].x > 20) {
                                stage.players.players[i].lookStop();
                                stage.players.players[i].left(true);
                                stage.players.players[i].timeout("left", false, random(1000, 2000));
                            }
                        } else if (dir2 == 1) {
                            if (stage.players.players[i].x < stage.level.width - (stage.players.players[i].width + 20)) {
                                stage.players.players[i].lookStop();
                                stage.players.players[i].right(true);
                                stage.players.players[i].timeout("right", false, random(1000, 2000));
                            }
                        }
                    }
                }
            }
        }

        if (stage.players.players[i].falling) {
            if (!stage.players.players[i].jumpReleased) stage.players.players[i].jumpReleased = true;
        } else if (!stage.players.players[i].paused) {
            var r = random(1, 100);
            if (r == 1) {
                stage.players.players[i].jump(true);
            }
        }
    }
}

MenuView.prototype.render = function(now, stage) { 
    if (!this.ready) this.ready = true;
    clearRect(this.view.ctx_render, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
    for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(now, stage, stage.level.layers[i]); 
    this.view.dirty=false;
}

MenuView.prototype.renderLayer = function(now, stage, layer) { 
    if (!stage.players || !stage.players.players) return;
    if (layer.draw === false) return;
    var layername = layer.name;
    if (layername != "players") return;
    
    var canvas = this.view.canvas_render;
    var ctx = this.view.ctx_render;
    
    var view = getViewWindow(canvas, stage.level.width, stage.level.height );
    var dx = (canvas.width - view.width) / 2;                 
    var dy = (canvas.height - view.height) - this.viewtop;               

    var scale = view.width / stage.level.width;
    
    this.renderPlayers(now, ctx, stage, dx, dy, scale); 
}

MenuView.prototype.renderPlayers = function(now, ctx, stage, x, y, scale) {
    for (var i = 0; i < stage.players.players.length; i++) this.renderPlayer(now, ctx, stage.players.players[i], x, y, scale);
}

MenuView.prototype.renderPlayer = function(now, ctx, player, x, y, scale) {
    this.view.renderPlayer(player, now, ctx, x, y, scale);
}