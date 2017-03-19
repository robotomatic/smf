"use strict";

function MenuView(gamecontroller, id, width, height, scale) {
    this.view = new View(gamecontroller, id, width, height, scale);
    this.ready = false;
    var controller = this;
    gamecontroller.main.onclick = function(e) {
        if (controller.paused) return;
        if (e.target.id != "gamecanvas") return;
        window.location.hash="#game";
    }
    this.follow = false;
    this.offset = {
        x : 0,
        y : 20,
        z : 20
    }
    this.view.renderer.camera.blur.blur = false;
    this.view.renderer.camera.blur.shift = false;
    this.view.renderer.camera.drift.enabled = false;
}

MenuView.prototype.setCameraLoose = function() {
}

MenuView.prototype.setCameraCosy = function() {
}

MenuView.prototype.setCameraComfy = function() {
}

MenuView.prototype.setCameraTight = function() {
}

MenuView.prototype.view;

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

MenuView.prototype.render = function(now, game) { 
    if (this.follow) this.renderFollow(now, game);
    else this.renderStatic(now, game);
}

MenuView.prototype.renderStatic = function(now, game) { 
    var world = game.world;
    if (!this.ready) {
        world.players.sortByHeight();
        this.ready = true;
    }
    this.view.renderer.mbr.width = world.level.width;
    this.view.renderer.mbr.height = world.level.height - 50;
    this.view.renderer.mbr.x = 0;
    var canvas = this.view.graphics.view.canvas;
    var scale = this.view.renderer.mbr.width / canvas.width;
    var vh = canvas.height * scale;
    var vd = vh - this.view.renderer.mbr.height;
    var vy = vd / 2;
    this.view.renderer.mbr.y = -vy;
    this.view.render(now, world, true);
}

MenuView.prototype.renderFollow = function(now, game) { 

    var world = game.world;
    this.view.renderer.mbr = world.players.getMbr(this.view.renderer.mbr);

    var offx = this.offset.x;
    this.view.renderer.mbr.x -= offx;
    this.view.renderer.mbr.width += offx;
    
    var offy = this.offset.y;
    this.view.renderer.mbr.y -= offy;
    this.view.renderer.mbr.height += offy;
    
    var offz = this.offset.z;
    this.view.renderer.mbr.z -= offz;
    this.view.renderer.mbr.depth += offz;
    
    this.view.render(now, world);
}



MenuView.prototype.update = function(now, delta, game) {
    var world = game.world;
    this.view.update(now, delta, world);
    if (!world.players || !world.players.players.length) return;
    var t = world.players.players.length;
    this.follow = t == 1;
    for (var i = 0; i < t; i++) {
        var npc = world.npcs.npcs[i];
        this.updateNPC(world, npc);
    }
}


MenuView.prototype.reset = function() {
    this.view.reset();
}

MenuView.prototype.updateNPC = function(world, npc) {
    var player = npc.player;
    var viewpad = 100;
    var hviewpad = viewpad / 2;
    
    if (player.controller.x <= viewpad) {
        player.controller.x = viewpad;
        if (player.controller.move_left) player.controller.left(false);
    } else if (player.controller.x >= world.level.width - (player.controller.width + viewpad)) {
        player.controller.x = world.level.width - (player.controller.width + viewpad);
        if (player.controller.move_right) player.controller.right(false);        
    }

//    if (player.controller.z <= -hviewpad) {
//        player.controller.z = -hviewpad;
//        if (player.controller.move_in) player.controller.in(false);
//    } else if (player.controller.z >= world.level.layers[0].depth - viewpad) {
//        player.controller.z = world.level.layers[0].depth - viewpad;
//        if (player.controller.move_out) player.controller.out(false);
//    }
    
    if (!player.controller.paused && !player.controller.move_left && !player.controller.move_right && player.controller.grounded) {
        var dir = random(0, 8);
        if (dir == 0) {
            if (player.controller.x > viewpad) {
                npc.doActionTimeout("left", true, false, random(1000, 3000));
            }
        } else if (dir == 1) {
            if (player.controller.x < world.level.width - (player.controller.width + viewpad))  {
                npc.doActionTimeout("right", true, false, random(1000, 3000));
            }
//        } else if (dir == 2) {
//            if (player.controller.z > -hviewpad)  {
//                npc.doActionTimeout("in", true, false, random(1000, 3000));
//            }
//        } else if (dir == 3) {
//            if (player.controller.z < world.level.layers[0].depth - viewpad)  {
//                npc.doActionTimeout("out", true, false, random(1000, 3000));
//            }
        } else {
            if (!player.controller.falling) {
                var pw = player.controller.x + (player.controller.width / 2);
                var safe = true;
                var paused = true;
                for (var ii = 0; ii < world.players.players.length; ii++) {
                    if (world.players.players[ii] == player) continue;
                    if (world.players.players[ii].controller.paused) {
                        var npcw = world.players.players[ii].controller.x + (world.players.players[ii].controller.width / 2)
                        var d = abs(pw - npcw);
                        if (d < 30) {
                            safe = false;
                            break;
                        }
                    } else paused = false;
                }
                if (safe) {
                    if (paused) {
                        
                        // todo: if everybody is paused, sway for a bit!!!!!!
                        npc.doActionTimeout("pause", true, false, random(1000, 3000));
                        
                    } else {
                        npc.doActionTimeout("pause", true, false, random(1000, 3000));
                    }
                } else {
                    var dir2 = random(0, 1);
                    if (dir2 == 0) {
                        if (player.controller.x > viewpad) {
                            npc.doActionTimeout("left", true, false, random(1000, 2000));
                        }
                    } else if (dir2 == 1) {
                        if (player.controller.x < world.level.width - (player.controller.width + viewpad))  {
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
