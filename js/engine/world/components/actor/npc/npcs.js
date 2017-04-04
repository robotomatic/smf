"use strict";

function NPCs() {
    this.npcs = new Array();
    this.callback = "";
}

NPCs.prototype.addNPC = function(npc) { 
    this.npcs.push(npc); 
}


NPCs.prototype.removeNPC = function(player) {
    var t = this.npcs.length;
    for (var i = 0; i < t; i++) {
        var n = this.npcs[i];
        if (n.player == player) {
            n = null;
            this.npcs.splice(i, 1);
            break;
        }
    }
//    updateDevNPCs(this.npcs);
}


NPCs.prototype.doAction = function(action, args, key, val, callback, playercallback) { 
    this.callback = callback;
    for (var i = 0; i < this.npcs.length; i++)  {
        this.npcs[i].doAction(action, args, key, val, playercallback);
    }
}

NPCs.prototype.reset = function(when) {
    for (var i = 0; i < this.npcs.length; i++)  {
        this.npcs[i].reset(when);
    }
}
    
NPCs.prototype.update = function(when, delta, world) {
    var docallback = true;
    for (var i = 0; i < this.npcs.length; i++) {
        var npc = this.npcs[i];
        if (!npc) continue;
        this.updateNPC(when, world, npc);
        if (npc && (npc.action || npc.timeout.action)) {
            var update = npc.update(when, delta);
            if (update) docallback = false;
        }
    }
    if (docallback && this.callback) {
        this.callback();
        this.callback = "";
    }
}

NPCs.prototype.updateNPC = function(when, world, npc) {
     var player = npc.player;
    
    if (!player) return;
    
    var viewpad = 10;
    
    if (player.controller.x <= viewpad) {
        player.controller.x = viewpad;
        if (player.controller.move_left) {
            player.controller.left(false);
            player.controller.stop();
            npc.stop();
        }
    } else if (player.controller.x >= world.level.width - (player.controller.width + viewpad)) {
        player.controller.x = world.level.width - (player.controller.width + viewpad);
        if (player.controller.move_right) {
            player.controller.right(false);        
            player.controller.stop();
            npc.stop();
        }
    }

    if (player.controller.z <= viewpad) {
        player.controller.z = viewpad;
        if (player.controller.move_in) {
            player.controller.in(false);
            player.controller.stop();
            npc.stop();
        }
    } else if (player.controller.z >= world.level.depth - viewpad) {
        player.controller.z = world.level.depth - viewpad;
        if (player.controller.move_out) {
            player.controller.out(false);
            player.controller.stop();
            npc.stop();
        }
    }
    
    if (!player.controller.waiting && 
        !player.controller.move_left && 
        !player.controller.move_right && 
        !player.controller.move_in && 
        !player.controller.move_out && 
        player.controller.grounded) {
        
        var dir = random(0, 8);
        if (dir == 0) {
            if (player.controller.x > viewpad) {
                npc.doActionTimeout("left", true, false, when, random(1000, 3000));
            }
        } else if (dir == 1) {
            if (player.controller.x < world.level.width - (player.controller.width + viewpad))  {
                npc.doActionTimeout("right", true, false, when, random(1000, 3000));
            }
        } else if (dir == 2) {
            if (player.controller.z > viewpad)  {
                npc.doActionTimeout("out", true, false, when, random(1000, 3000));
            }
        } else if (dir == 3) {
            if (player.controller.z < world.level.depth - viewpad)  {
                npc.doActionTimeout("in", true, false, when, random(1000, 3000));
            }
        } else {
            if (!player.controller.falling) {
                var pw = player.controller.x + (player.controller.width / 2);
                var safe = true;
                var paused = true;
                for (var ii = 0; ii < world.players.players.length; ii++) {
                    if (world.players.players[ii] == player) continue;
                    if (world.players.players[ii].controller.waiting) {
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
                        npc.doActionTimeout("wait", true, false, when, random(1000, 3000));
                        
                    } else {
                        npc.doActionTimeout("wait", true, false, when, random(1000, 3000));
                    }
                } else {
                    var dir2 = random(0, 4);
                    if (dir2 == 0) {
                        if (player.controller.x > viewpad) {
                            npc.doActionTimeout("left", true, false, when, random(1000, 2000));
                        }
                    } else if (dir2 == 1) {
                        if (player.controller.x < world.level.width - (player.controller.width + viewpad))  {
                            npc.doActionTimeout("right", true, false, when, random(1000, 2000));
                        }
                    }
                }
            }
        }
    }
    if (player.controller.falling) {
        if (!player.controller.jumpReleased) player.controller.jumpReleased = true;
    } else if (!player.controller.waiting) {
        var r = random(1, 100);
        if (r == 1) {
            player.controller.jump(true);
        }
    }
}
