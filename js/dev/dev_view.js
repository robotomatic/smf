"use strict";

var dev_size_view_label = null;
var dev_size_stretch = null;
var dev_size_auto = null;
var dev_size_view_width = null;
var dev_size_view_height = null;
var dev_size_view_ratio = null;

var dev_overlay = null;
var dev_gamepads = null;

var dev_view_dof_blur = null;

var dev_pause = null;

function initializeDevView() {
    
    if (!__dev) return;

    dev_size_view_label = document.getElementById("dev-stretch-label");
    
    dev_size_stretch = document.getElementById("dev-stretch");
    dev_size_stretch.onclick = function() {
        toggleDevViewStretch();
    };
    dev_size_auto = document.getElementById("dev-auto");
    dev_size_auto.onclick = function() {
        toggleDevViewAuto();
    };
    dev_size_view_width = document.getElementById("dev-view-width");
    dev_size_view_width.onchange = function() {
        changeDevViewSize();
    };
    dev_size_view_height = document.getElementById("dev-view-height");
    dev_size_view_height.onchange = function() {
        changeDevViewSize();
    };
    dev_size_view_ratio = document.getElementById("dev-view-ratio");
    dev_size_view_ratio.onchange = function() {
        changeDevViewRatio();
    };
    
    dev_gamepads = document.getElementById("gamepads");
    
    dev_overlay = document.getElementById("dev-overlay");
    dev_overlay.onclick = function() {
        toggleDevViewOverlay();
    };
    
    dev_pause = document.getElementById("dev-debug-pause");
    dev_pause.onclick = function() {
        devPause();
    };

    dev_view_dof_blur = document.getElementById("dev-view-dof-blur");
    dev_view_dof_blur.onchange = function() {
        setDevViewDepthOfFieldBlur(this.checked);
    };
    
    initializeDevViewRender();
    updateDevViewOverlay();
}


function resetDevView(world) {
    resetDevViewRender(world);
}


function toggleDevViewStretch() {
    if (!__dev) return;
    updateViews("toggleStretch");
    updateDevView();
}

function toggleDevViewAuto() {
    if (!__dev) return;
    updateViews("toggleAuto");
    updateDevView();
}


function changeDevViewSize() {
    if (!__dev) return;
    var ww = dev_size_view_width;
    var w = ww.value;
    var hh = dev_size_view_height;
    var h = hh.value;
    if (dev_size_auto.checked) toggleDevViewAuto();
    updateViews("setSize", [w, h]);
    updateDevView();
}

function changeDevViewRatio() {
    if (!__dev) return;
    var rr = dev_size_view_ratio;
    var r = rr.value;
    updateViews("setRatio", r);
    updateDevView();
}




function updateDevView() {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    updateDevViewSize(vv);
    updateDevViewDepthOfFieldBlur(vv);
    updateDevViewRender();
 }

function updateDevViewSize(v) {
    if (!__dev) return;
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






function toggleDevViewOverlay() {
    if (!__dev) return;
    var gp = dev_gamepads;
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
    var gp = dev_gamepads;
    if (!gp) {
        dev_overlay.checked = false;
        dev_overlay.disabled = true;
        return;
    }
    dev_overlay.disabled = false;
    var showing = isVisible(gp);
    dev_overlay.checked = showing;
}

function devPause() {
    if (!__dev) return;
    var paused = controller.paused;
    if (paused) {
        controller.resume(timestamp());
        dev_pause.value = "Pause";
        updateDevViewOverlay();
    } else {
        controller.pause(timestamp());
        dev_pause.value = "Play";
        dev_overlay.disabled = true;
    }
}


function updateDevViewDepthOfFieldBlur(vv) {
    if (!__dev) return;
    var blur = vv.renderer.camera.blur.blur;
    var vb = dev_view_dof_blur;
    vb.checked = blur;
}

function setDevViewDepthOfFieldBlur(blur) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camera.blur.blur = blur;
    updateDevViewDepthOfFieldBlur(vv);
}

