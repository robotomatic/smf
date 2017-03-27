"use strict";

var gamecontroller = null;
var fpsmain = null;
var devlog = null;
var devfps = null;
var devfpstype = [];
var elapsed = [];
var delay = 5;
var dialogs = new Array();
var dev_init = false;

function initializeDev(game) {
    
    if (!__dev) return;
    if (dev_init) return;
    dev_init = true;
    
    fpsmain = null;
    devlog = null;
    devfps = null;
    devfpstype = [];
    elapsed = [];
    delay = 5;
    dialogs = new Array();
    
    gamecontroller = game;
    var toolbar = document.getElementById("dev-toolbar");
    if (toolbar) {
        toolbar.onclick = function(e) {
            toggleDev();
            e.stopPropagation()
            e.preventDefault();
            return false;
        };
    }

    var tools = document.getElementsByClassName("dev-toolbar-tools-tool");
    for (var i = 0; i < tools.length; i++) {
        tools[i].onclick = function(e) {
            if (isMobile()) {
                unselectTools();
                this.className += " dev-toolbar-tools-tool-selected";
            }
            var typ = this.id.replace("dev-tools-", "");
            var nid = "dev-dialog-" + typ;
            toggleDevDialog(nid);
            e.stopPropagation()
            e.preventDefault();
            return false;
        };
    }

    var devTabClick = function(e) {
        var dlg = this.parentNode.parentNode.parentNode.parentNode;
        var seltabs = findChildrenByClassName(dlg, "dialog-tab-list-tabs-tab-selected");
        for (var i = 0; i < seltabs.length; i++) {
            seltabs[i].className = seltabs[i].className.replace(" dialog-tab-list-tabs-tab-selected", "");
        }    
        this.className += " dialog-tab-list-tabs-tab-selected";
        var sellists = findChildrenByClassName(dlg, "dialog-tab-list-list-tablist-selected");
        for (var ii = 0; ii < sellists.length; ii++) {
            var sellist = sellists[ii];
            sellist.className = sellist.className.replace(" dialog-tab-list-list-tablist-selected", "");
            sellist.className += " hidden";
        }    
        var tabid = this.id.replace("dialog-tab-list-tab-", "");
        var tablist = document.getElementById("dialog-tab-list-list-" + tabid);
        if (tablist) {
            tablist.className = tablist.className.replace(" hidden", "");
            tablist.className += " dialog-tab-list-list-tablist-selected";
        }
        e.stopPropagation()
        e.preventDefault();
        return false;
    }
    
    var tabs = document.getElementsByClassName("dialog-tab-list-tabs-tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', devTabClick, false);
    }    
    
    initializeDevDebug();
    initializeDevSize();
    initializeDevCamera();
    initializeDevMeta();
    initializeDevWorld();
    initializeDevPlayers();
    initializeDevPlayer();
    resizeDev();
}

function unselectTools() {
    var tools = document.getElementsByClassName("dev-toolbar-tools-tool");
    for (var i = 0; i < tools.length; i++) {
        tools[i].className = tools[i].className.replace(" dev-toolbar-tools-tool-selected", "");
    }
}

function resetDev(game) {
    if (!__dev) return;
    gamecontroller = game;
    var world = gamecontroller.game.loop.game.world;
    if (world) {
        resetDevPlayers(world.players);
        resetDevWorld(world);
    }
    updateDevViewOverlay();
}
    
function resizeDev() {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    updateDevViewSize(vv);
    updateDevViewCamera(vv);
}

function toggleDev() {
    
    if (!__dev) return;
    unselectTools();
    var dev = document.getElementById("dev");
    var tt = document.getElementById("dev-toolbar-tools");
    if (!tt) return;
    var w = tt.offsetWidth;
    if (w) {
        tt.style.width = 0;
        dev.style.width = "auto";
        if (isMobile()) hideDialogs("");
    } else {
        tt.style.width = "auto";
        if (isMobile()) dev.style.width = "100%";
    }
}

function toggleDevDialog(nid) {
    
    if (!__dev) return;
    
    var d = document.getElementById(nid);
    if (!d) return;

    hideDialogs(nid);
    
    if (isMobile() && dialogs[nid]) {
        var md = dialogs[nid];
        var p = md.dialog.className.indexOf("hidden");
        if (p < 0) md.dialog.className += " hidden";
        else md.dialog.className = md.dialog.className.replace("hidden", "");
        return;
    }
    
    var dr = d.getBoundingClientRect();
    
    var p = document.getElementById("main-content");
    
    var rect = p.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    
    var t = 50;
    var l = w - dr.width - 15;
    if (isMobile()) {
        t = 30;
        l = 0;
    }
    
    d.style.top = t + "px";
    d.style.left = l + "px";
    d.className = d.className.replace("hidden", "");
    
    var ddd = dialogs[nid];
    if (!ddd) {
        ddd = new Dialog(nid, d);
        dialogs[nid] = ddd;    
    } else {
        dialogs[nid].reset();
    }
    
    dialogs[nid].bringToTop();
}

function hideDialogs(id) {
    var keys = Object.keys(dialogs);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (k == id) continue;
        var ddd = dialogs[k];
        if (!ddd.moved) {
            var p = ddd.dialog.className.indexOf("hidden");
            if (p < 0) ddd.dialog.className += " hidden";
        }
    }
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