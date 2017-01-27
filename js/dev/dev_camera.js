"use strict";

function initializeDevCamera() {
    document.getElementById("dev-camera-offset-x-amount").onchange = function() {
        setDevCameraOffsetX(this.value);
    };
    document.getElementById("dev-camera-offset-x-amount-range").onchange = function() {
        setDevCameraOffsetX(this.value);
    };
    document.getElementById("dev-camera-offset-y-amount").onchange = function() {
        setDevCameraOffsetY(this.value);
    };
    document.getElementById("dev-camera-offset-y-amount-range").onchange = function() {
        setDevCameraOffsetY(this.value);
    };
    document.getElementById("dev-camera-offset-z-amount").onchange = function() {
        setDevCameraOffsetZ(this.value);
    };
    document.getElementById("dev-camera-offset-z-amount-range").onchange = function() {
        setDevCameraOffsetZ(this.value);
    };

    document.getElementById("dev-camera-follow-speed").onchange = function() {
        setDevCameraFollowSpeed(this.value);
    };
    document.getElementById("dev-camera-drift").onchange = function() {
        setDevCameraDrift(this.checked);
    };
    document.getElementById("dev-camera-drift-min").onchange = function() {
        setDevCameraDriftMin(this.value);
    };
    document.getElementById("dev-camera-drift-max").onchange = function() {
        setDevCameraDriftMax(this.value);
    };
    document.getElementById("dev-camera-drift-speed").onchange = function() {
        setDevCameraDriftSpeed(this.value);
    };
    
    document.getElementById("dev-fov-amount").onchange = function() {
        setDevCameraFOV(this.value);
    };
    document.getElementById("dev-fov-amount-range").onchange = function() {
        setDevCameraFOV(this.value);
    };
}






function updateDevViewCamera(v) {
    updateDevViewCameraOffset(v);
    updateDevViewCameraFollowSpeed(v);
    updateDevViewCameraDrift(v);
    updateDevViewCameraFOV(v);
}






function setDevCameraOffsetX(x) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.offset.x = Number(x);
    updateDevViewCameraOffset(vv);
}

function setDevCameraOffsetY(y) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.offset.y = Number(y);
    updateDevViewCameraOffset(vv);
}

function setDevCameraOffsetZ(z) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.offset.z = Number(z);
    updateDevViewCameraOffset(vv);
}

function updateDevViewCameraOffset(vv) {
    if (!vv.offset) return;
    var x = vv.offset.x;
    var xx = document.getElementById("dev-camera-offset-x-amount");
    xx.value = (x == undefined) ? 0 : x;
    var xxx = document.getElementById("dev-camera-offset-x-amount-range");
    xxx.value = x;
    
    var y = vv.offset.y;
    var yy = document.getElementById("dev-camera-offset-y-amount");
    yy.value = (y == undefined) ? 0 : y;
    var yyy = document.getElementById("dev-camera-offset-y-amount-range");
    yyy.value = y;
    
    var z = vv.offset.z;
    var zz = document.getElementById("dev-camera-offset-z-amount");
    zz.value = (z == undefined) ? 0 : z;
    var zzz = document.getElementById("dev-camera-offset-z-amount-range");
    zzz.value = z;
}




function setDevCameraFollowSpeed(speed) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.view.renderer.camera.speed = speed;
    updateDevViewCameraFollowSpeed(vv);
}

function updateDevViewCameraFollowSpeed(vv) {
    var speed = vv.view.renderer.camera.speed;
    document.getElementById("dev-camera-follow-speed").value = speed;
}




function setDevCameraDrift(drift) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.view.renderer.camera.drift.enabled = drift;
    updateDevViewCameraDrift(vv);
}

function setDevCameraDriftMin(min) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.view.renderer.camera.drift.min = min;
    updateDevViewCameraDrift(vv);
}

function setDevCameraDriftMax(max) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.view.renderer.camera.drift.max = max;
    updateDevViewCameraDrift(vv);
}

function setDevCameraDriftSpeed(speed) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.view.renderer.camera.drift.speed = speed;
    updateDevViewCameraDrift(vv);
}

function updateDevViewCameraDrift(vv) {
    var drift = vv.view.renderer.camera.drift.enabled;
    var vd = document.getElementById("dev-camera-drift");
    vd.checked = drift;
    var min = vv.view.renderer.camera.drift.min;
    var vdmin = document.getElementById("dev-camera-drift-min");
    vdmin.value = min;
    var max = vv.view.renderer.camera.drift.max;
    var vdmax = document.getElementById("dev-camera-drift-max");
    vdmax.value = max;
    var speed = vv.view.renderer.camera.drift.speed;
    var vds = document.getElementById("dev-camera-drift-speed");
    vds.value = speed;
}







function setDevCameraFOV(z) {
    setFOV(Number(z));
    updateDevViewCameraFOV();
}

function updateDevViewCameraFOV() {
    var z = getFOV();
    var zz = document.getElementById("dev-fov-amount");
    zz.value = z;
    var zzz = document.getElementById("dev-fov-amount-range");
    zzz.value = z;
}