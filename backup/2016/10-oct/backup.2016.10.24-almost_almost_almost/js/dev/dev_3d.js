"use strict";

function initializeDev3D() {
    document.getElementById("dev-blur-amount").onchange = function() {
        setBlur(this.value);
    };
    document.getElementById("dev-blur-amount-range").onchange = function() {
        setBlur(this.value);
    };
    document.getElementById("dev-zoom-amount").onchange = function() {
        setZoom(this.value);
    };
    document.getElementById("dev-zoom-amount-range").onchange = function() {
        setZoom(this.value);
    };
    document.getElementById("dev-fov-amount").onchange = function() {
        setDevFOV(this.value);
    };
    document.getElementById("dev-fov-amount-range").onchange = function() {
        setDevFOV(this.value);
    };
}

function setBlur(b) {
    updateViews("setBlur", b);
    updateDevView();
}

function updateDevViewBlur(v) {
    var b = v.bluramount;
    var rr = document.getElementById("dev-blur-amount");
    rr.value = b;
    var rrr = document.getElementById("dev-blur-amount-range");
    rrr.value = b;
}

function setZoom(z) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.playerpad = Number(z);
    updateDevViewZoom(vv);
}

function updateDevViewZoom(vv) {
    var z = vv.playerpad;
    var zz = document.getElementById("dev-zoom-amount");
    zz.value = (z == undefined) ? 0 : z;
    var zzz = document.getElementById("dev-zoom-amount-range");
    zzz.value = z;
}

function setDevFOV(z) {
    setFOV(Number(z));
    updateDevViewFOV();
}

function updateDevViewFOV() {
    var z = getFOV();
    var zz = document.getElementById("dev-fov-amount");
    zz.value = z;
    var zzz = document.getElementById("dev-fov-amount-range");
    zzz.value = z;
}

