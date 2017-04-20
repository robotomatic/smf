"use strict";

var dev_player = null;
var dev_character = null;
var dev_guts = null;
var dev_level = null;
var dev_render = null;
var dev_hsr = null;
var dev_collision = null;
var dev_waterline = null;

function initializeDevDebug() {
    
    if (!__dev) return;

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
    dev_waterline = document.getElementById("dev-debug-waterline");
    dev_waterline.onchange = function() {
        setDebugWaterline(this.checked);
    };
}

function updateDevDebug() {
    if (!__dev) return;
    updateDevDebugPlayers();
    updateDevDebugCharacters();
    updateDevDebugGutss();
    updateDevDebugLevel();
    updateDevDebugRender();
    updateDevDebugHSR();
    updateDevDebugCollision();
    updateDevDebugWaterline();
}





function setDebugPlayers(debug) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    gamecontroller.gamesettings.settings.debug.player.player = debug;
    updateDevDebugPlayers();
}

function updateDevDebugPlayers() {
    if (!__dev) return;
    var debug = gamecontroller.gamesettings.settings.debug.player.player;
    dev_player.checked = debug;
}

function setDebugCharacters(debug) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    gamecontroller.gamesettings.settings.debug.player.character = debug;
    updateDevDebugCharacters();
}

function updateDevDebugCharacters() {
    if (!__dev) return;
    var debug = gamecontroller.gamesettings.settings.debug.player.character;
    dev_character.checked = debug;
}

function setDebugGutss(debug) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    gamecontroller.gamesettings.settings.debug.player.guts = debug;
    updateDevDebugGutss();
}

function updateDevDebugGutss() {
    if (!__dev) return;
    var debug = gamecontroller.gamesettings.settings.debug.player.guts;
    dev_guts.checked = debug;
}





function setDebugLevel(debug) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    gamecontroller.gamesettings.settings.debug.level.level = debug;
    updateDevDebugLevel();
}

function updateDevDebugLevel() {
    if (!__dev) return;
    var debug = gamecontroller.gamesettings.settings.debug.level.level;
    dev_level.checked = debug;
}

function setDebugRender(debug) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    gamecontroller.gamesettings.settings.debug.level.render = debug;
    updateDevDebugRender();
}

function updateDevDebugRender() {
    if (!__dev) return;
    var debug = gamecontroller.gamesettings.settings.debug.level.render;
    dev_render.checked = debug;
}

function setDebugHSR(debug) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    gamecontroller.gamesettings.settings.debug.level.hsr = debug;
    updateDevDebugHSR();
}

function updateDevDebugHSR() {
    if (!__dev) return;
    var debug = gamecontroller.gamesettings.settings.debug.level.hsr;
    dev_hsr.checked = debug;
}






function setDebugCollision(debug) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    gamecontroller.gamesettings.settings.debug.collision = debug;
    updateDevDebugCollision();
}

function updateDevDebugCollision() {
    if (!__dev) return;
    var debug = gamecontroller.gamesettings.settings.debug.collision;
    dev_collision.checked = debug;
}







function setDebugWaterline(debug) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    gamecontroller.gamesettings.settings.debug.waterline = debug;
    updateDevDebugWaterline();
}

function updateDevDebugWaterline() {
    if (!__dev) return;
    var debug = gamecontroller.gamesettings.settings.debug.waterline;
    dev_waterline.checked = debug;
}