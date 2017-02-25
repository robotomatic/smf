"use strict";

function initializeDevCamera() {
    
    if (!__dev) return;
    
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

    document.getElementById("dev-camera-dof-blur-blur").onchange = function() {
        setDevCameraDepthOfFieldBlurBlur(this.checked);
    };
    document.getElementById("dev-camera-dof-blur-shift").onchange = function() {
        setDevCameraDepthOfFieldBlurShift(this.checked);
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
    
    if (!__dev) return;
    
    updateDevViewCameraOffset(v);
    updateDevViewCameraDepthOfFieldBlur(v);
    updateDevViewCameraFollowSpeed(v);
    updateDevViewCameraDrift(v);
    updateDevViewCameraFOV(v);
}






function setDevCameraOffsetX(x) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.offset.x = Number(x);
    updateDevViewCameraOffset(vv);
}

function setDevCameraOffsetY(y) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.offset.y = Number(y);
    updateDevViewCameraOffset(vv);
}

function setDevCameraOffsetZ(z) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.offset.z = Number(z);
    updateDevViewCameraOffset(vv);
}

function updateDevViewCameraOffset(vv) {
    
    if (!__dev) return;
    
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
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.view.renderer.camera.speed = speed;
    updateDevViewCameraFollowSpeed(vv);
}

function updateDevViewCameraFollowSpeed(vv) {
    
    if (!__dev) return;
    
    var speed = vv.view.renderer.camera.speed;
    document.getElementById("dev-camera-follow-speed").value = speed;
}


function updateDevViewCameraDepthOfFieldBlur(vv) {
    
    if (!__dev) return;
    
    updateDevViewCameraDepthOfFieldBlurBlur(vv);
    updateDevViewCameraDepthOfFieldBlurShift(vv);
}




function setDevCameraDepthOfFieldBlurBlur(blur) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.view.renderer.camera.blur.blur = blur;
    updateDevViewCameraDepthOfFieldBlurBlur(vv);
}

function updateDevViewCameraDepthOfFieldBlurBlur(vv) {
    
    if (!__dev) return;
    
    var blur = vv.view.renderer.camera.blur.blur;
    var vb = document.getElementById("dev-camera-dof-blur-blur");
    vb.checked = blur;
}

function setDevCameraDepthOfFieldBlurShift(shift) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.view.renderer.camera.blur.shift = shift;
    updateDevViewCameraDepthOfFieldBlurShift(vv);
}

function updateDevViewCameraDepthOfFieldBlurShift(vv) {
    
    if (!__dev) return;
    
    var shift = vv.view.renderer.camera.blur.shift;
    var vb = document.getElementById("dev-camera-dof-blur-shift");
    vb.checked = shift;
}



function setDevCameraDrift(drift) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.view.renderer.camera.drift.enabled = drift;
    updateDevViewCameraDrift(vv);
}

function setDevCameraDriftMin(min) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.view.renderer.camera.drift.min = min;
    updateDevViewCameraDrift(vv);
}

function setDevCameraDriftMax(max) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.view.renderer.camera.drift.max = max;
    updateDevViewCameraDrift(vv);
}

function setDevCameraDriftSpeed(speed) {
    
    if (!__dev) return;
    
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    vv.view.renderer.camera.drift.speed = speed;
    updateDevViewCameraDrift(vv);
}

function updateDevViewCameraDrift(vv) {
    
    if (!__dev) return;
    
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
    
    if (!__dev) return;
    
    setFOV(Number(z));
    updateDevViewCameraFOV();
}

function updateDevViewCameraFOV() {
    
    if (!__dev) return;
    
    var z = getFOV();
    var zz = document.getElementById("dev-fov-amount");
    zz.value = z;
    var zzz = document.getElementById("dev-fov-amount-range");
    zzz.value = z;
}