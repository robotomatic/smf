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
    
    if (!__dev) return;
    
    fpsmain = null;
    devlog = null;
    devfps = null;
    devfpstype = [];
    elapsed = [];
    delay = 5;
    dialogs = new Array();
    
    gamecontroller = game;
    document.getElementById("dev-toolbar").onclick = function() {
        toggleDev();
    };

    var tools = document.getElementsByClassName("dev-toolbar-tools-tool");
    for (var i = 0; i < tools.length; i++) {
        tools[i].onclick = function(e) {
            var typ = this.id.replace("dev-tools-", "");
            var nid = "dev-dialog-" + typ;
            toggleDevDialog(nid);
            e.stopPropagation()
            e.preventDefault();
            return false;
        };
    }
    
    initializeDevDebug();
    initializeDevSize();
    initializeDevCamera();
    initializeDevPlayers();
    initializeDevPlayer();
    resizeDev();
}

function resizeDev() {
    
    if (!__dev) return;
    
    var gp = document.getElementById("gamepads");
    if (!gp) return;
    var style = window.getComputedStyle(gp);
    var chk = document.getElementById("dev-overlay");
    chk.checked = (style.display === 'none') ? false : true;
}

function toggleDev() {
    
    if (!__dev) return;
    
    var tt = document.getElementById("dev-toolbar-tools");
    if (!tt) return;
    var w = tt.offsetWidth;
    if (w) {
        tt.style.width = 0;
    } else {
        tt.style.width = "auto";
    }
}

function toggleDevDialog(nid) {
    
    if (!__dev) return;
    
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
    
    var ddd = dialogs[nid];
    if (!ddd) {
        ddd = new Dialog(nid, d);
        dialogs[nid] = ddd;    
    } else dialogs[nid].reset();
    
    dialogs[nid].bringToTop();
}

function handleDevFocus(elem) {
    elem.focused = false;
    elem.hasFocus = function() {
        return this.focused;
    };
    elem.onfocus=function() {
        this.focused=true;
    };
    elem.onblur=function() {
        this.focused=false;
    };        
}


function updateViews(f, args) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (!Array.isArray(gamecontroller.game)) updateView(gamecontroller.game.loop.game.views, f, args); 
    else for (var i = 0; i < gamecontroller.game.length; i++) updateView(gamecontroller.game[i].loop.game.views, f, args); 
}

function updateView(v, f, a) {
    
    if (!__dev) return;
    
    var t = v.length;
    for (var i = 0; i < t; i++) v[i].view[f](a);
}

function updateDevView() {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    var v = vv.view;
    updateDevViewSize(v);
    updateDevViewCamera(vv);
    updateDevDebug();
 }