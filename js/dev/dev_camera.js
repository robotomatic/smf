"use strict";

var dev_camera_offset_x_amount = null;
var dev_camera_offset_x_range = null;
var dev_camera_offset_y_amount = null;
var dev_camera_offset_y_range = null;
var dev_camera_offset_z_amount = null;

var dev_camera_offset_fit = null;
var dev_camera_offset_loose = null;
var dev_camera_offset_comfy = null;
var dev_camera_offset_tight = null;

var dev_camera_offset_z_range = null;
var dev_camera_dof_blur = null;
var dev_camera_follow_speed = null;
var dev_camera_drift = null;
var dev_camera_drift_min = null;
var dev_camera_drift_max = null;
var dev_camera_drift_speed = null;
var dev_camera_fov_amount = null;
var dev_camera_fov_range = null;

function initializeDevCamera() {
    
    if (!__dev) return;
    
    dev_camera_offset_x_amount = document.getElementById("dev-camera-offset-x-amount");
    dev_camera_offset_x_amount.onchange = function() {
        setDevCameraOffsetX(this.value);
    };
    dev_camera_offset_x_range = document.getElementById("dev-camera-offset-x-amount-range");
    dev_camera_offset_x_range.onchange = function() {
        setDevCameraOffsetX(this.value);
    };
    dev_camera_offset_y_amount = document.getElementById("dev-camera-offset-y-amount");
    dev_camera_offset_y_amount.onchange = function() {
        setDevCameraOffsetY(this.value);
    };
    dev_camera_offset_y_range = document.getElementById("dev-camera-offset-y-amount-range");
    dev_camera_offset_y_range.onchange = function() {
        setDevCameraOffsetY(this.value);
    };
    dev_camera_offset_z_amount = document.getElementById("dev-camera-offset-z-amount");
    dev_camera_offset_z_amount.onchange = function() {
        setDevCameraOffsetZ(this.value);
    };
    dev_camera_offset_z_range = document.getElementById("dev-camera-offset-z-amount-range");
    dev_camera_offset_z_range.onchange = function() {
        setDevCameraOffsetZ(this.value);
    };
    
    dev_camera_offset_fit = document.getElementById("dev-camera-offset-fit");
    dev_camera_offset_fit.onclick = function() {
        setDevCameraOffsetFit();
    };
    dev_camera_offset_loose = document.getElementById("dev-camera-offset-loose");
    dev_camera_offset_loose.onclick = function() {
        setDevCameraOffsetLoose();
    };
    dev_camera_offset_comfy = document.getElementById("dev-camera-offset-comfy");
    dev_camera_offset_comfy.onclick = function() {
        setDevCameraOffsetComfy();
    };
    dev_camera_offset_tight = document.getElementById("dev-camera-offset-tight");
    dev_camera_offset_tight.onclick = function() {
        setDevCameraOffsetTight();
    };

    dev_camera_dof_blur = document.getElementById("dev-camera-dof-blur");
    dev_camera_dof_blur.onchange = function() {
        setDevCameraDepthOfFieldBlur(this.checked);
    };
    
    dev_camera_follow_speed = document.getElementById("dev-camera-follow-speed");
    dev_camera_follow_speed.onchange = function() {
        setDevCameraFollowSpeed(this.value);
    };
    dev_camera_drift = document.getElementById("dev-camera-drift");
    dev_camera_drift.onchange = function() {
        setDevCameraDrift(this.checked);
    };
    dev_camera_drift_min = document.getElementById("dev-camera-drift-min");
    dev_camera_drift_min.onchange = function() {
        setDevCameraDriftMin(this.value);
    };
    dev_camera_drift_max = document.getElementById("dev-camera-drift-max");
    dev_camera_drift_max.onchange = function() {
        setDevCameraDriftMax(this.value);
    };
    dev_camera_drift_speed = document.getElementById("dev-camera-drift-speed");
    dev_camera_drift_speed.onchange = function() {
        setDevCameraDriftSpeed(this.value);
    };
    
    dev_camera_fov_amount = document.getElementById("dev-fov-amount");
    dev_camera_fov_amount.onchange = function() {
        setDevCameraFOV(this.value);
    };
    dev_camera_fov_range = document.getElementById("dev-fov-amount-range");
    dev_camera_fov_range.onchange = function() {
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
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camerasettings.x = Number(x);
    vv.renderer.camera.reset();
    updateDevViewCameraOffset(vv);
}

function setDevCameraOffsetY(y) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camerasettings.y = Number(y);
    vv.renderer.camera.reset();
    updateDevViewCameraOffset(vv);
}

function setDevCameraOffsetZ(z) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camerasettings.z = Number(z);
    vv.renderer.camera.reset();
    updateDevViewCameraOffset(vv);
}

function updateDevViewCameraOffset(vv) {
    if (!__dev) return;
    if (!vv.renderer.camerasettings) return;
    var x = vv.renderer.camerasettings.x;
    var xx = dev_camera_offset_x_amount;
    xx.value = (x == undefined) ? 0 : x;
    var xxx = dev_camera_offset_x_range;
    xxx.value = x;
    var y = vv.renderer.camerasettings.y;
    var yy = dev_camera_offset_y_amount;
    yy.value = (y == undefined) ? 0 : y;
    var yyy = dev_camera_offset_y_range;
    yyy.value = y;
    var z = vv.renderer.camerasettings.z;
    var zz = dev_camera_offset_z_amount;
    zz.value = (z == undefined) ? 0 : z;
    var zzz = dev_camera_offset_z_range;
    zzz.value = z;
}




function setDevCameraOffsetFit() {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camera.reset();
    vv.setCameraFit();
}

function setDevCameraOffsetLoose() {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camera.reset();
    vv.setCameraLoose();
}

function setDevCameraOffsetComfy() {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camera.reset();
    vv.setCameraComfy();
}

function setDevCameraOffsetTight() {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camera.reset();
    vv.setCameraTight();
}




function setDevCameraFollowSpeed(speed) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camera.speed = speed;
    updateDevViewCameraFollowSpeed(vv);
}

function updateDevViewCameraFollowSpeed(vv) {
    if (!__dev) return;
    var speed = vv.renderer.camera.speed;
    dev_camera_follow_speed.value = speed;
}



function updateDevViewCameraDepthOfFieldBlur(vv) {
    if (!__dev) return;
    var blur = vv.renderer.camera.blur.blur;
    var vb = dev_camera_dof_blur;
    vb.checked = blur;
}




function setDevCameraDepthOfFieldBlur(blur) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camera.blur.blur = blur;
    updateDevViewCameraDepthOfFieldBlur(vv);
}





function setDevCameraDrift(drift) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camera.drift.enabled = drift;
    updateDevViewCameraDrift(vv);
}

function setDevCameraDriftMin(min) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camera.drift.min = min;
    updateDevViewCameraDrift(vv);
}

function setDevCameraDriftMax(max) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camera.drift.max = max;
    updateDevViewCameraDrift(vv);
}

function setDevCameraDriftSpeed(speed) {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var vv = gamecontroller.game.loop.gameworld.views[0];
    vv.renderer.camera.drift.speed = speed;
    updateDevViewCameraDrift(vv);
}

function updateDevViewCameraDrift(vv) {
    if (!__dev) return;
    var drift = vv.renderer.camera.drift.enabled;
    var vd = dev_camera_drift;
    vd.checked = drift;
    var min = vv.renderer.camera.drift.min;
    var vdmin = dev_camera_drift_min;
    vdmin.value = min;
    var max = vv.renderer.camera.drift.max;
    var vdmax = dev_camera_drift_max;
    vdmax.value = max;
    var speed = vv.renderer.camera.drift.speed;
    var vds = dev_camera_drift_speed;
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
    var zz = dev_camera_fov_amount;
    zz.value = z;
    var zzz = dev_camera_fov_range;
    zzz.value = z;
}