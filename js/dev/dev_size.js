"use strict";

function initializeDevSize() {
    
    if (!__dev) return;
    
    document.getElementById("dev-stretch").onclick = function() {
        toggleStretch();
    };
    document.getElementById("dev-auto").onclick = function() {
        toggleAuto();
    };
    document.getElementById("dev-view-width").onchange = function() {
        changeSize();
    };
    document.getElementById("dev-view-height").onchange = function() {
        changeSize();
    };
    document.getElementById("dev-view-ratio").onchange = function() {
        changeRatio();
    };
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
    
    var ww = document.getElementById("dev-view-width");
    var w = ww.value;
    var hh = document.getElementById("dev-view-height");
    var h = hh.value;
    updateViews("setSize", [w, h]);
    updateDevView();
}

function changeRatio() {
    
    if (!__dev) return;
    
    var rr = document.getElementById("dev-view-ratio");
    var r = rr.value;
    updateViews("setRatio", r);
    updateDevView();
}

function updateDevViewSize(v) {
    
    if (!__dev) return;
    
    var vs = round(v.viewscale);
    var vv = document.getElementById("dev-stretch-label");
    vv.innerText = vs;
    var w = v.width;
    var h = v.height;
    var ww = document.getElementById("dev-view-width");
    ww.value = w;
    var hh = document.getElementById("dev-view-height");
    hh.value = h;
    var r = w / h;
    var rr = document.getElementById("dev-view-ratio");
    rr.value = round(r);
    var ss = document.getElementById("dev-stretch");
    ss.checked = v.view.fit;
    var aa = document.getElementById("dev-auto");
    aa.checked = v.view.auto;
}
