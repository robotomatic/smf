"use strict";

function initializeDevDebug() {
    document.getElementById("dev-overlay").onclick = function() {
        toggleOverlay();
    };
    document.getElementById("dev-debug-player").onchange = function() {
        setDebugPlayer(this.checked);
    };
    document.getElementById("dev-debug-player-player").onchange = function() {
        setDebugPlayer(this.checked);
    };
    document.getElementById("dev-debug-character").onchange = function() {
        setDebugCharacter(this.checked);
    };
    document.getElementById("dev-debug-player-character").onchange = function() {
        setDebugCharacter(this.checked);
    };
    document.getElementById("dev-debug-collision").onchange = function() {
        setDebugCollision(this.checked);
    };
    document.getElementById("dev-debug-level").onchange = function() {
        setDebugLevel(this.checked);
    };
}

function updateDevDebug() {
    updateDevDebugOverlay();
    updateDevDebugPlayer();
    updateDevDebugCharacter();
    updateDevDebugRender();
}

function toggleOverlay() {
    var gp = document.getElementById("gamepads");
    if (!gp) return;
    var hide = gp.className.indexOf("hidden-all") > -1;
    if (hide) {
        gp.className = gp.className.replace("hidden-all", "");
        gp.className += " show-all";
    } else {
        var show = gp.className.indexOf("show-all") > -1;
        if (show) {
            gp.className = gp.className.replace("show-all", "");
            gp.className += " hidden-all";
        } else {
            var style = window.getComputedStyle(gp);
            if (style.display === 'none') {
                gp.className += " show-all";
            } else {
                gp.className += " hidden-all";
            }
        }
    }
}

function updateDevDebugOverlay() {
    var gp = document.getElementById("gamepads");
    if (!gp) return;
    var hide = gp.className.indexOf("hidden-all") > -1;
    document.getElementById("dev-overlay").checked = hide;
}

function setDebugPlayer(debug) {
    
    return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    gamecontroller.game.loop.game.stage.players.debug = debug;
    updateDevDebugPlayer();
}

function updateDevDebugPlayer() {
    
    return;
    
    var debug = gamecontroller.game.loop.game.stage.players.debug;
    document.getElementById("dev-debug-player").checked = debug;
    document.getElementById("dev-debug-player-player").checked = debug;
}

function setDebugCharacter(debug) {
    
    return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var t = gamecontroller.game.loop.game.stage.players.players.length;
    for (var i = 0; i < t; i++) gamecontroller.game.loop.game.stage.players.players[i].renderer.debug = debug;
    updateDevDebugCharacter();
}

function updateDevDebugCharacter() {
    
    return;
    
    if (!gamecontroller.game.loop.game.stage.players.players.length) return;
    var debug = gamecontroller.game.loop.game.stage.players.players[0].renderer.debug;
    document.getElementById("dev-debug-character").checked = debug;
    document.getElementById("dev-debug-player-character").checked = debug;
}

function setDebugCollision(debug) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    // todo
    //gamecontroller.game.loop.game.stage.stagerenderer.itemcache.debug = debug;
}

function setDebugLevel(debug) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    gamecontroller.game.loop.game.stage.stagerenderer.itemcache.debug = debug;
}

function setDebugRender(debug) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    gamecontroller.game.loop.game.stage.stagerenderer.debug.render = debug;
    updateDevDebugRender();
}

function updateDevDebugRender() {
    var debug = gamecontroller.game.loop.game.stage.stagerenderer.debug.render;
    document.getElementById("dev-debug-render").checked = debug;
}