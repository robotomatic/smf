"use strict";

function initializeDevDebug() {
    document.getElementById("dev-overlay").onclick = function() {
        toggleOverlay();
    };
    document.getElementById("dev-debug-player").onchange = function() {
        setDebugPlayer(this.checked);
    };
    document.getElementById("dev-debug-level").onchange = function() {
        setDebugLevel(this.checked);
    };
    document.getElementById("dev-debug-character").onchange = function() {
        setDebugCharacter(this.checked);
    };
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

function setDebugPlayer(debug) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    gamecontroller.game.loop.game.stage.players.debug = debug;
}

function setDebugCharacter(debug) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var t = gamecontroller.game.loop.game.stage.players.players.length;
    for (var i = 0; i < t; i++) gamecontroller.game.loop.game.stage.players.players[i].renderer.debug = debug;
}

function setDebugLevel(debug) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    gamecontroller.game.loop.game.stage.stagerenderer.itemcache.debug = debug;
}
