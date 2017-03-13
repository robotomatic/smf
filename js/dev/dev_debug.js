"use strict";

var dev_overlay = null;
var dev_player = null;
var dev_character = null;
var dev_guts = null;
var dev_level = null;
var dev_render = null;
var dev_hsr = null;
var dev_collision = null;

var gamepads = null;

function initializeDevDebug() {
    
    if (!__dev) return;

    gamepads = document.getElementById("gamepads");
    
    dev_overlay = document.getElementById("dev-overlay");
    dev_overlay.onclick = function() {
        toggleOverlay();
    };
    dev_player = document.getElementById("dev-debug-player");
    dev_player.onchange = function() {
        setDebugPlayers(this.checked);
    };
    dev_character = document.getElementById("dev-debug-character");
    dev_character.onchange = function() {
        setDebugCharacters(this.checked);
    };
    dev_guts = document.getElementById("dev-debug-guts");
    dev_guts.onchange = function() {
        setDebugGutss(this.checked);
    };
    dev_level = document.getElementById("dev-debug-level");
    dev_level.onchange = function() {
        setDebugLevel(this.checked);
    };
    dev_render = document.getElementById("dev-debug-render");
    dev_render.onchange = function() {
        setDebugRender(this.checked);
    };
    dev_hsr = document.getElementById("dev-debug-hsr");
    dev_hsr.onchange = function() {
        setDebugHSR(this.checked);
    };
    dev_collision = document.getElementById("dev-debug-collision");
    dev_collision.onchange = function() {
        setDebugCollision(this.checked);
    };
}

function updateDevDebug() {
    
    if (!__dev) return;
    
    updateDevDebugOverlay();
    updateDevDebugPlayers();
    updateDevDebugCharacters();
    updateDevDebugGutss();
    updateDevDebugLevel();
    updateDevDebugRender();
    updateDevDebugHSR();
}

function toggleOverlay() {
    
    if (!__dev) return;
    
    var gp = gamepads;
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
    
    if (!__dev) return;
    
    var gp = gamepads;
    if (!gp) return;
    var hide = gp.className.indexOf("hidden-all") > -1;
    dev_overlay.checked = hide;
}

function setDebugPlayers(debug) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var t = gamecontroller.game.loop.game.world.players.players.length;
    gamecontroller.game.loop.game.world.worldrenderer.debug.player.player = debug;
    updateDevDebugPlayers();
}

function updateDevDebugPlayers() {
    
    if (!__dev) return;
    
    var debug = gamecontroller.game.loop.game.world.worldrenderer.debug.player.player;
    dev_player.checked = debug;
}

function setDebugCharacters(debug) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    gamecontroller.game.loop.game.world.worldrenderer.debug.player.character = debug;
    updateDevDebugCharacters();
}

function updateDevDebugCharacters() {
    
    if (!__dev) return;
    
    var debug = gamecontroller.game.loop.game.world.worldrenderer.debug.player.character;
    dev_character.checked = debug;
}

function setDebugGutss(debug) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    gamecontroller.game.loop.game.world.worldrenderer.debug.player.guts = debug;
    updateDevDebugGutss();
}

function updateDevDebugGutss() {
    
    if (!__dev) return;
    
    if (!gamecontroller.game.loop.game.world.players.players.length) return;
    var debug = gamecontroller.game.loop.game.world.worldrenderer.debug.player.guts;
    dev_guts.checked = debug;
}

function setDebugCollision(debug) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    // todo
    //gamecontroller.game.loop.game.world.worldrenderer.itemcache.debug = debug;
}

function setDebugLevel(debug) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    gamecontroller.game.loop.game.world.worldrenderer.debug.level.level = debug;
    updateDevDebugLevel();
}

function updateDevDebugLevel() {
    
    if (!__dev) return;
    
    var debug = gamecontroller.game.loop.game.world.worldrenderer.debug.level.level;
    dev_level.checked = debug;
}

function setDebugRender(debug) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    gamecontroller.game.loop.game.world.worldrenderer.debug.level.render = debug;
    updateDevDebugRender();
}

function updateDevDebugRender() {
    
    if (!__dev) return;
    
    var debug = gamecontroller.game.loop.game.world.worldrenderer.debug.level.render;
    dev_render.checked = debug;
}

function setDebugHSR(debug) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    gamecontroller.game.loop.game.world.worldrenderer.debug.level.hsr = debug;
    updateDevDebugHSR();
}

function updateDevDebugHSR() {
    
    if (!__dev) return;
    
    var debug = gamecontroller.game.loop.game.world.worldrenderer.debug.level.hsr;
    dev_hsr.checked = debug;
}