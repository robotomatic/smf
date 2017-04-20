"use strinct"

function ViewGraphics() {
    this.graphics = {
        blur_mega : {
            canvas : null,
            css : "",
            scale : 1,
            blur : 2
        },
        blur_max : {
            canvas : null,
            css : "",
            scale : 1,
            blur : 1
        },
        blur_med : {
            canvas : null,
            css : "",
            scale : 1,
            blur : 0.5
        },
        blur : {
            canvas : null,
            css : "",
            scale : 1,
            blur : 0.2
        },
        main : {
            canvas : null,
            css : "",
            scale : 1,
            blur : 0
        },
        blur_min : {
            canvas : null,
            css : "",
            scale : 1,
            blur : 1
        }
    }
}

ViewGraphics.prototype.createGraphics = function() { 
    var keys = Object.keys(this.graphics);
    for (var i = 0; i < keys.length; i++)  {
        this.createCanvas(this.graphics[keys[i]]);
    }
}
    
ViewGraphics.prototype.createCanvas = function(graphics) {     
    graphics.canvas = new GameCanvas("");
    var classname = "absolute game-canvas";
    if (graphics.css) classname += " " + graphics.css;
    graphics.canvas.setClassName(classname);
}

ViewGraphics.prototype.getGraphics = function(camera, renderitem) {
    var g = null;
    if (camera.blur.blur) {
        if (renderitem.blur > 0) {
            if (renderitem.blur >= 100) g = this.graphics["blur_mega"];
            else if (renderitem.blur >= 10) g = this.graphics["blur_max"];
            else if (renderitem.blur >= 6) g = this.graphics["blur_med"];
            else g = this.graphics["blur"];
        } else if (renderitem.blur < 0) {
            g = this.graphics["blur_min"];
        } else {
            g = this.graphics["main"];
        }
    } else {
        g = this.graphics["main"];
    }
    return g;
}
