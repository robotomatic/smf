"use strict";

var gamecontroller = null;
var fpsmain = null;
var devlog = null;
var devfps = null;
var devfpstype = [];
var elapsed = [];
var delay = 5;
var dialogs = new Array();

function initializeDev(game) {
    
    fpsmain = null;
    devlog = null;
    devfps = null;
    devfpstype = [];
    elapsed = [];
    delay = 5;
    dialogs = new Array();
    
    gamecontroller = game;
    document.getElementById("dev-toolbar-fps").onclick = function() {
        toggleDev();
    };

    var tools = document.getElementsByClassName("dev-toolbar-tools-tool");
    for (var i = 0; i < tools.length; i++) {
        tools[i].onclick = function() {
            toggleDevDialog(this.id);
        };
    }
    
    initializeDevDebug();
    initializeDevSize();
    initializeDevCamera();
    initializeDevFPS();
    initializeDevPlayers();
    initializeDevPlayer();
    resizeDev();
}

function resizeDev() {
    var gp = document.getElementById("gamepads");
    if (!gp) return;
    var style = window.getComputedStyle(gp);
    var chk = document.getElementById("dev-overlay");
    chk.checked = (style.display === 'none') ? false : true;
}

function toggleDev() {
    var tt = document.getElementById("dev-toolbar-tools");
    if (!tt) return;
    var w = tt.offsetWidth;
    if (w) {
        tt.style.width = 0;
    } else {
        tt.style.width = "auto";
    }
}

function toggleDevDialog(did) {
    var typ = did.replace("dev-tools-", "");
    var nid = "dev-dialog-" + typ;
    var d = document.getElementById(nid);
    if (!d) return;
    var p = document.getElementById("main-content");
    var rect = p.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    var dw = d.offsetWidth + 10;
    var dh = d.offsetHeight + 10;
    var l = random(10, w - dw);
    var t = random(10, h - dh);
    d.style.top = t + "px";
    d.style.left = l + "px";
    d.className = d.className.replace("hidden", "");
    
    var did = dialogs[nid];
    if (!did) {
        did = new Dialog(nid, d);
        dialogs[nid] = did;    
    } else dialogs[nid].reset();
}


function updateViews(f, args) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (!Array.isArray(gamecontroller.game)) updateView(gamecontroller.game.loop.game.views, f, args); 
    else for (var i = 0; i < gamecontroller.game.length; i++) updateView(gamecontroller.game[i].loop.game.views, f, args); 
}

function updateView(v, f, a) {
    var t = v.length;
    for (var i = 0; i < t; i++) v[i].view[f](a);
}

function updateDevView() {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    var v = vv.view;
    updateDevViewSize(v);
    updateDevViewCamera(vv);
    updateDevDebug();
 }