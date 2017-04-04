"use strinct"

function ViewGraphics() {
    this.graphics = {
        blur_max : {
            canvas : null,
            css : "",
            scale : 1,
            blur : 3
        },
        blur : {
            canvas : null,
            css : "",
            scale : 1,
            blur : 1
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
            blur : 3
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