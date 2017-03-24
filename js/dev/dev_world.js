"use strict";

var dev_world_level = null;

function initializeDevWorld() {
    
    if (!__dev) return;
    
    dev_world_level = document.getElementById("dev-world-level");
    dev_world_level.onchange = function(e) {
        setTimeout(function() {
            changeWorldLevel(dev_world_level.value);
        }, 1000);
    };
}

function resetDevWorld(world) {
    
    // todo: remove all layer info
    updateDevWorld(world);
    
}

function updateDevWorld(world) {
    
    if (!__dev) return;
    
    var level = world.level;
    var levels = controller.gameloader.levels;
    var keys = controller.gameloader.levelkeys;
    if (!keys || !keys.length) return;
    
    var total = dev_world_level.length;
    var lt = keys.length;
    
    if (total != lt) {
        dev_world_level.innerHTML = "";
        for (var i = 0; i < lt; i++) {
            var alevel = levels[keys[i]];
            var opt = document.createElement('option');
            opt.value = keys[i];
            opt.innerHTML = alevel.name;
            if (alevel.name == level.name) opt.selected = true;
            dev_world_level.appendChild(opt);        
        }
    }
    
}

function changeWorldLevel(levelname) {
    
    if (!__dev) return;
    
    var world = controller.game.loop.game.world;
    
    var level = world.level;
    if (levelname == level.name) return;

    var newlevel = null;
    var levels = controller.gameloader.levels;
    var keys = controller.gameloader.levelkeys;
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        if (keys[i] == levelname) {
            var alevel = levels[keys[i]];
            newlevel = alevel;
            break;
        }
    }
    
    if (!newlevel) {
        logDev("Unable to locate level: " + levelname);
        return;
    }

    //
    // TODO: No workeeeeeeeeeeeeeyyyyyy
    //
    
    controller.pause(timestamp());
    controller.game.reset();
    controller.game.loadLevel(newlevel, levelname, function() {
        controller.game.startPlayers();
        controller.resume(timestamp());
    });
}