"use strict";

function MenuView(id, width, height, scale, quality) {
    this.quality = quality;
    this.view = new View(id, width, height, scale, this.quality);
    this.ready = false;
    var controller = this;
    this.view.canvas_render.onclick = function() {
        window.location.hash="#menu-player";
        
    }
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

MenuView.prototype.render = function(now, stage) { 
    if (!this.ready) {
        stage.players.sortByHeight();
        this.ready = true;
    }
    this.view.renderer.mbr.width = stage.level.width;
    this.view.renderer.mbr.height = stage.level.height + 60;
    this.view.renderer.mbr.x = 0;
    var scale = this.view.renderer.mbr.width / this.view.canvas_render.width;
    var vh = this.view.canvas_render.height * scale;
    var vd = vh - this.view.renderer.mbr.height;
    var vy = vd / 2;
    this.view.renderer.mbr.y = -vy;
    this.view.render(now, stage);
}

MenuView.prototype.update = function(now, stage) {
    this.view.update(now, stage);
    if (!stage.players || !stage.players.players.length) return;
    for (var i = 0; i < stage.players.players.length; i++) {
        var npc = stage.npcs.npcs[i];
        this.updateNPC(stage, npc);
    }
}

MenuView.prototype.updateNPC = function(stage, npc) {
    var player = npc.player;
    var viewpad = 100;
    
    if (player.controller.x <= viewpad) {
        player.controller.x = viewpad;
        if (player.controller.move_left) player.controller.left(false);
    } else if (player.controller.x >= stage.level.width - (player.controller.width + viewpad)) {
        player.controller.x = stage.level.width - (player.controller.width + viewpad);
        if (player.controller.move_right) player.controller.right(false);        
    }
    
    if (!player.controller.paused && !player.controller.move_left && !player.controller.move_right && player.controller.grounded) {
        var dir = random(0, 8);
        if (dir == 0) {
            if (player.controller.x > viewpad) {
                npc.doActionTimeout("left", true, false, random(1000, 3000));
            }
        } else if (dir == 1) {
            if (player.controller.x < stage.level.width - (player.controller.width + viewpad))  {
                npc.doActionTimeout("right", true, false, random(1000, 3000));
            }
        } else {
            if (!player.controller.falling) {
                var safe = true;
                for (var ii = 0; ii < stage.players.players.length; ii++) {
                    if (stage.players.players[ii] == player) continue;
                    if (stage.players.players[ii].controller.paused) {
                        var d = Math.abs(stage.players.players[ii].controller.x - player.controller.x);
                        if (d < 20) {
                            safe = false;
                            break;
                        }
                    }
                }
                if (safe) npc.doActionTimeout("pause", true, false, random(1000, 3000));
                else {
                    var dir2 = random(0, 1);
                    if (dir2 == 0) {
                        if (player.controller.x > viewpad) {
                            npc.doActionTimeout("left", true, false, random(1000, 2000));
                        }
                    } else if (dir2 == 1) {
                        if (player.controller.x < stage.level.width - (player.controller.width + viewpad))  {
                            npc.doActionTimeout("right", true, false, random(1000, 2000));
                        }
                    }
                }
            }
        }
    }
    if (player.controller.falling) {
        if (!player.controller.jumpReleased) player.controller.jumpReleased = true;
    } else if (!player.controller.paused) {
        var r = random(1, 100);
        if (r == 1) {
            player.controller.jump(true);
        }
    }
}