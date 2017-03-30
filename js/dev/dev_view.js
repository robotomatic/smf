"use strict";

var dev_size_view_label = null;
var dev_size_stretch = null;
var dev_size_auto = null;
var dev_size_view_width = null;
var dev_size_view_height = null;
var dev_size_view_ratio = null;

var dev_overlay = null;
var gamepads = null;

var dev_pause = null;

function initializeDevSize() {
    
    if (!__dev) return;

    dev_size_view_label = document.getElementById("dev-stretch-label");
    
    dev_size_stretch = document.getElementById("dev-stretch");
    dev_size_stretch.onclick = function() {
        toggleStretch();
    };
    dev_size_auto = document.getElementById("dev-auto");
    dev_size_auto.onclick = function() {
        toggleAuto();
    };
    dev_size_view_width = document.getElementById("dev-view-width");
    dev_size_view_width.onchange = function() {
        changeSize();
    };
    dev_size_view_height = document.getElementById("dev-view-height");
    dev_size_view_height.onchange = function() {
        changeSize();
    };
    dev_size_view_ratio = document.getElementById("dev-view-ratio");
    dev_size_view_ratio.onchange = function() {
        changeRatio();
    };
    
    gamepads = document.getElementById("gamepads");
    
    dev_overlay = document.getElementById("dev-overlay");
    dev_overlay.onclick = function() {
        toggleOverlay();
    };
    
    dev_pause = document.getElementById("dev-debug-pause");
    dev_pause.onclick = function() {
        debugPause();
    };
    
    
    updateDevViewOverlay();
}

function toggleStretch() {
    
    if (!__dev) return;
    
    updateViews("toggleStretch");
    updateDevView();
}

function toggleAuto() {
    
    if (!__dev) return;
    
    updateViews("toggleAuto");
    updateDevView();
}


function changeSize() {
    
    if (!__dev) return;
    
    var ww = dev_size_view_width;
    var w = ww.value;
    var hh = dev_size_view_height;
    var h = hh.value;
    
    if (dev_size_auto.checked) toggleAuto();
    
    updateViews("setSize", [w, h]);
    updateDevView();
}

function changeRatio() {
    
    if (!__dev) return;
    
    var rr = dev_size_view_ratio;
    var r = rr.value;
    updateViews("setRatio", r);
    updateDevView();
}




function updateDevView() {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    updateDevViewSize(vv);
 }

function updateDevViewSize(vv) {
    
    if (!__dev) return;
    
    
    var v = vv.view;

    var vs = round(v.viewscale);
    var vv = dev_size_view_label;
    vv.innerText = vs;
    var w = v.width;
    var h = v.height;
    var ww = dev_size_view_width;
    ww.value = w;
    var hh = dev_size_view_height;
    hh.value = h;
    var r = w / h;
    var rr = dev_size_view_ratio;
    rr.value = round(r);
    var ss = dev_size_stretch;
    ss.checked = v.rendertarget.fit;
    var aa = dev_size_auto;
    aa.checked = v.rendertarget.auto;
}






function toggleOverlay() {
    
    if (!__dev) return;
    
    var gp = gamepads;
    if (!gp) return;
    var showing = isVisible(gp);
    if (showing) {
        hide(gp);
    } else {
        show(gp);
    }
    
    updateDevViewOverlay();
}


function updateDevViewOverlay() {
    if (!__dev) return;
    var gp = gamepads;
    if (!gp) {
        dev_overlay.checked = false;
        dev_overlay.disabled = true;
        return;
    }
    dev_overlay.disabled = false;
    var showing = isVisible(gp);
    dev_overlay.checked = showing;
}

function debugPause() {
    
    if (!__dev) return;
    
    var paused = controller.paused;
    if (paused) {
        controller.resume(timestamp());
        dev_pause.value = "Pause";
        dev_overlay.disabled = false;
    } else {
        controller.pause(timestamp());
        dev_pause.value = "Play";
        dev_overlay.disabled = true;
    }
}



