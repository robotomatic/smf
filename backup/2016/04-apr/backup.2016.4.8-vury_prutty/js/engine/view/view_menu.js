"use strict";

function MenuView(id, width, height, scale) {
    this.view = new View(id, width, height, scale);
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
    this.view.renderer.mbr.height = stage.level.height + 50;
    
    this.view.renderer.mbr.x = 0;
    var scale = this.view.renderer.mbr.width / this.view.canvas_render.width;
    var vh = this.view.canvas_render.height * scale;
    var vd = vh - this.view.renderer.mbr.height;
    var vy = vd / 2;
    this.view.renderer.mbr.y = -vy;
    
    this.view.renderer.mbr.pad(100);
    this.view.render(now, stage);
}

MenuView.prototype.update = function(now, stage) {
    this.view.update(now, stage);
    if (!stage.players || !stage.players.players.length) return;
    // todo: offload this to players controller class?
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