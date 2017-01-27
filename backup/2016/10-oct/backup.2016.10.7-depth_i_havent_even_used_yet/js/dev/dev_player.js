"use strict";

var devplayercanvas = null;
var devplayerctx = null;
var devplayerimg = new Image(null, 0, 0, 0, 0);

function initializeDevPlayer() {
    document.getElementById("dev-player-canvas").resize = function() {
        resizeDevPlayerCanvas();
    };
}

function updateDevPlayer(img) {
    devplayerimg.data = img.data;
    devplayerimg.width = img.width;
    devplayerimg.height = img.height;
    resizeDevPlayerCanvas();
}

function resizeDevPlayerCanvas() {
    if (!devplayercanvas) devplayercanvas = document.getElementById("dev-player-canvas");
    if (!devplayercanvas) return;
    if (!devplayerctx) devplayerctx = devplayercanvas.getContext("2d");
    if (!devplayerimg) return;
    devplayercanvas.width = devplayercanvas.offsetWidth;
    devplayercanvas.height = devplayercanvas.offsetHeight;
    var w = devplayercanvas.width;
    var h = devplayercanvas.height;
    clearRect(devplayerctx, 0, 0, w, h);
    var nw = devplayerimg.width;
    var nh = devplayerimg.height;
    if (nw > nh) {
        var r = nh / nw;
        nw = w;
        nh = nw * r; 
    } else {
        var r = nw / nh;
        nh = h;
        nw = nh * r; 
    }
    if (nh > h) {
        var d = h / nh;
        nw *= d;
        nh = h;
    }
    if (nw > w) {
        var d = w / nw;
        nh *= d;
        nw = w;
    }
    var nx = (w - nw) / 2;
    var ny = (h - nh) / 2;
    devplayerimg.draw(devplayerctx, nx, ny, nw, nh);
}