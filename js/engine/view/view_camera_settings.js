"use strict";

function ViewCameraSettings(viewrenderer) {
    this.viewrenderer = viewrenderer;
    this.x = 0;
    this.y = 300;
    this.z = 500;
    this.name = "loose";
    this.settings = {
        tight : {
            x : 0,
            y : -125,
            z : 25
        },
        cosy : {
            x : 0,
            y : -50,
            z : 100
        },
        comfy : {
            x : 0,
            y : 100,
            z : 150
        },
        loose : {
            x : 0,
            y : 300,
            z : 500
        },
        full : {
            x : 0,
            y : 0,
            z : -1500
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
