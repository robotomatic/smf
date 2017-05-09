"use strict";

function ViewCameraSettings(viewrenderer) {
    this.viewrenderer = viewrenderer;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.name = "loose";
    this.settings = {
        tight : {
            x : 0,
            y : -25,
            z : 150
        },
        comfy : {
            x : 0,
            y : 30,
            z : 400
        },
        loose : {
            x : 0,
            y : 300,
            z : 500
        },
        fit : {
            x : 0,
            y : 0,
            z : 0
        }
    };
}


ViewCameraSettings.prototype.setCameraZoom = function(name) {
    if (!this.settings[name]) return;
    this.x = this.settings[name].x;
    this.y = this.settings[name].y;
    this.z = this.settings[name].z;
    this.name = name;
}
