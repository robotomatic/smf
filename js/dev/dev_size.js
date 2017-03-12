"use strict";

var dev_size_view_label = null;
var dev_size_stretch = null;
var dev_size_auto = null;
var dev_size_view_width = null;
var dev_size_view_height = null;
var dev_size_view_ratio = null;

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
    ss.checked = v.view.fit;
    var aa = dev_size_auto;
    aa.checked = v.view.auto;
}
