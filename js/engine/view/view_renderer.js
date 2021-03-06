"use strict";

function ViewRenderer(view) {

    this.view = view;
    this.debug = false;
    this.mbr = new Rectangle(0, 0, 0, 0);
    this.lastmbr = new Rectangle(0, 0, 0, 0);
    this.window = new Rectangle(0, 0, 0, 0);
    this.camera = new ViewCamera();

    this.camerasettings = new ViewCameraSettings(this);
    this.camerasettings.setCameraZoom((gamecontroller.gamesettings.settings.camera && gamecontroller.gamesettings.settings.camera.view) || "fit");

    this.rendercount = 0;
    this.renderwait = 10;
    
    this.fitcount = 0;
    this.fitwait = 10;
    
    this.fps = 0;
    this.avg = 0;
    this.tx = 20;
    this.ty = 20;
    this.fpstext = new Text(this.tx, this.ty, "FPS: ");
    
    this.image = new Image(null, 0, 0, 0, 0);

    this.graphics = new ViewGraphics();
    this.graphics.createGraphics();

    this.ready = false;
}





ViewRenderer.prototype.setCameraZoom = function(zoom) {
    this.camerasettings.setCameraZoom(zoom);
}





ViewRenderer.prototype.reset = function(when) { 
    this.ready = false;
    this.fitcount = 0;
    this.mbr.width = 0;
    this.mbr.height = 0;
    this.rendercount = 0;
    this.renderall = true;
    this.camera.reset();
}




ViewRenderer.prototype.render = function(now, world, paused) {
    this.setBackground(world);
    this.getViewWindow(world);
    if (!paused) this.rendercount++;
    if (this.rendercount < this.renderwait) return;
    this.clearGraphics();
    this.renderWorld(now, world, paused);
    this.renderView();
    this.renderFPS(paused);
}
    




ViewRenderer.prototype.setBackground = function(world) {
    if (world.debug.level.level || !world.worldrenderer.render.world) {
        this.view.parent.style.background = "white";
        this.view.rendertarget.canvas.setBackground("white");
        this.ready = false;
    } else if (world.worldrenderer.itemrenderer) {
        if (!this.ready) {
            if (world.worldrenderer.itemrenderer.theme && world.worldrenderer.itemrenderer.theme.background) {
                this.view.parent.style.background = world.worldrenderer.itemrenderer.theme.background.color;
                this.view.rendertarget.canvas.setBackground(world.worldrenderer.itemrenderer.theme.background.canvas.color);
                this.ready = true;
            } else {
                this.view.parent.style.background = "white";
                this.view.rendertarget.canvas.setBackground("white");
                this.ready = true;
            }
        }
    }
}
    




ViewRenderer.prototype.renderWorld = function(now, world, paused) {
    var width = this.view.rendertarget.canvas.width;
    var height = this.view.rendertarget.canvas.height;
    var follow = true;
    this.mbr = this.camera.getView(now, this.mbr, width, height, follow, paused);
    
    this.window.x = 0 - this.camera.offset.x;
    this.window.y = 0 - this.camera.offset.y;
    this.window.z = 0 - this.camera.offset.z;
    
    this.window.width = width;
    this.window.height = height;
    this.window.depth = 1;
    this.window.scale = this.mbr.scale;
    this.window.offset.x = this.camera.offset.x;
    this.window.offset.y = this.camera.offset.y;
    this.window.offset.z = this.camera.offset.z;
    world.render(now, this.graphics, this.camera, this.mbr, this.window, paused);
}



ViewRenderer.prototype.getViewWindow = function(world) { 
    var offx = this.camerasettings.x;
    var offy = this.camerasettings.y;
    var offz = this.camerasettings.z;
    this.mbr = world.players.getMbr(this.mbr);
    var cname = this.camerasettings.name;

    var fit = this.fitcount < this.fitwait;
    if (fit || cname == "fit" || (!this.mbr.width && !this.lastmbr.width)) {
        this.mbr = this.getViewBounds(world, this.mbr);
        this.fitcount++;
    } if (this.mbr && !this.mbr.width && !this.mbr.height) {
        this.mbr.x = this.lastmbr.x;
        this.mbr.y = this.lastmbr.y;
        this.mbr.z = this.lastmbr.z;
        this.mbr.width = this.lastmbr.width;
        this.mbr.height = this.lastmbr.height;
        this.mbr.depth = this.lastmbr.depth;
        this.mbr.scale = this.lastmbr.scale;
    } else {
        if (world.players.camera.count == 1) {
            if (offy < 0) {
                var player = world.players.camera.player;
                var py = player.controller.y;
                var ny = py + (offy * this.mbr.scale);
                if (this.mbr.y > ny) {
                    this.mbr.y = ny;         
                }
            }
        }
    }
    
    this.lastmbr.x = this.mbr.x;
    this.lastmbr.y = this.mbr.y;
    this.lastmbr.z = this.mbr.z;
    this.lastmbr.width = this.mbr.width;
    this.lastmbr.height = this.mbr.height;
    this.lastmbr.depth = this.mbr.depth;
    this.lastmbr.scale = this.mbr.scale;
    
    this.camera.offset.x = offx;
    this.camera.offset.y = offy;
    this.camera.offset.z = offz;
}

ViewRenderer.prototype.getViewBounds = function(world, mbr) {
    var b = world.worldcollider.bounds;
    mbr.x = b.min.x;
    mbr.y = 0;
    mbr.z = 0;
    mbr.width = b.max.x - b.min.x;
    mbr.height = b.max.y - mbr.y;
    mbr.depth = b.max.z - mbr.z;
    if (!world.level) {
        mbr.depth = 0;
        return mbr;
    }
    var width = this.view.width;
    var dw = width / mbr.width;
    mbr.scale = dw;
    return mbr;
}





ViewRenderer.prototype.clearGraphics = function() {
    var keys = Object.keys(this.graphics.graphics);
    for (var i = 0; i < keys.length; i++)  {
        this.clearViewGraphics(this.graphics.graphics[keys[i]]);
    }
    this.clearViewGraphics(this.view.rendertarget);
}

ViewRenderer.prototype.clearViewGraphics = function(graphics) {
    graphics.canvas.clear()
}

ViewRenderer.prototype.renderView = function() {
    var keys = Object.keys(this.graphics.graphics);
    for (var i = 0; i < keys.length; i++)  {
        this.renderViewGraphics(this.graphics.graphics[keys[i]]);
    }
}






ViewRenderer.prototype.renderViewGraphics = function(graphics) {
    graphics.canvas.commit();
    this.image.width = graphics.canvas.width;
    this.image.height = graphics.canvas.height;
    this.image.data = graphics.canvas;
    this.image.draw(this.view.rendertarget.canvas);
    if (graphics.blur && this.camera.blur.blur) {
        var blur = graphics.blur * graphics.scale;
        this.image.blur(this.view.rendertarget.canvas, blur);
    }
}


















ViewRenderer.prototype.updateFPS = function(type, fps, avg) {
    this.fps = fps;
    this.avg = avg;
}

ViewRenderer.prototype.renderFPS = function(paused) {
    if (!__dev) return;
    var fps = round(this.fps);
    if (fps < 10) fps = "0" + fps;
    var avg = round(this.avg);
    if (avg < 10) avg = "0" + avg;
    this.fpstext.message = paused ? "PAUSE" : "FPS: " + fps + "\n" + "AVG: " + avg;
    this.fpstext.x = this.tx;
    this.fpstext.y = this.ty;
    this.view.rendertarget.canvas.setFillStyle("black");
    this.view.rendertarget.canvas.beginPath();
    this.fpstext.draw(this.view.rendertarget.canvas, 12);
}
