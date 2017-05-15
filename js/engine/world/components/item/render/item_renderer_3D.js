"use strict";

function ItemRenderer3D() {
    this.colors = {
        front : "#dedede",
        side : "#d6d6d6",
        top : "#e8e8e8",
        bottom : "#cccccc"
    }
    this.dotop = false;
    this.fadepercent = 0.6;
    this.line = new Line();
}

ItemRenderer3D.prototype.renderItem3D = function(now, world, renderer, item, gamecanvas, scale, debug) {
    
    if (item.underwater) return;
    if (!renderer.shouldThemeProject(item)) return;

    var dodebug = (debug.level || debug.render || debug.hsr);
    if (debug.hsr && item.width != "100%") {
        gamecanvas.setAlpha(this.fadepercent);
    }
    
    this.getColors(world, gamecanvas, renderer, item, debug);
    
    var x = item.projectedlocation.x;
    var y = item.projectedlocation.y;

    var fill = item.draw === false ? false : true;
    var outline = item.draw === false ? false : fill ? true : dodebug ? true : false;
    
    if (item.width != "100%") {
        if (item.geometry.visible.left.visible || item.geometry.visible.right.visible) {
            var left = item.item3D.left && item.geometry.visible.left.visible;
            var right = item.item3D.right && item.geometry.visible.right.visible;
            var sides = left || right;
            if (sides) {
                if (left && item.geometry.left.showing) this.renderItemParts3D(gamecanvas, item, item.geometry.left, this.colors.side, x, y, scale, debug, outline, fill);
                else if (right && item.geometry.right.showing)  this.renderItemParts3D(gamecanvas, item, item.geometry.right, this.colors.side, x, y, scale, debug, outline, fill);
            }
        }

        if (item.bottom === true) {
            if (item.geometry.visible.bottom.visible && item.geometry.bottom.showing) {
                this.renderItemParts3D(gamecanvas, item, item.geometry.bottom, this.colors.bottom, x, y, scale, debug, outline, fill);
            }
        }
    }

    var topoutline = false;
    if (this.dotop) {
        if (item.geometry.visible.top.visible && item.geometry.top.showing) {
            topoutline = true;
            if (item.draw === false) topoutline = false;
            if (item.width == "100%") topoutline = false;
            //
            // todo: only draw outline on contiguous surfaces - tile of same type must exist on outline side
            //
            this.renderItemParts3D(gamecanvas, item, item.geometry.top, this.colors.top, x, y, scale, debug, false, fill);
            if (fill && item.width != "100%") {
                gamecanvas.setStrokeStyle(this.colors.top);
                gamecanvas.setLineWidth(1 * scale);
                gamecanvas.stroke();
                gamecanvas.commit();
            }
        }
    }

    var frontoutline = false;
    if (item.geometry.visible.front.visible) {
        //
        // todo: SOON! this can eventually go -- item cache will draw fronts
        //
        frontoutline = true;
        if (item.draw === false) frontoutline = false;
        if (item.width == "100%") frontoutline = false;
        this.renderItemParts3D(gamecanvas, item, item.geometry.front, this.colors.front, x, y, scale, debug, false, fill);
    }
    
    gamecanvas.commit();
    
    if (topoutline || frontoutline) {
        var lc = this.colors.side;
        var lw = 1 * scale;
        gamecanvas.setStrokeStyle(lc);
        gamecanvas.setLineWidth(lw);
        gamecanvas.beginPath();
        if (topoutline) {
            if (item.geometry.visible.back.visible) {
                this.line.start.x = item.geometry.top.geometry.points[0].x;
                this.line.start.y = item.geometry.top.geometry.points[0].y;
                this.line.end.x = item.geometry.top.geometry.points[1].x;
                this.line.end.y = item.geometry.top.geometry.points[1].y;
                this.line.path(gamecanvas);
            } 
            if (item.geometry.visible.left.visible) {
                this.line.start.x = item.geometry.top.geometry.points[3].x;
                this.line.start.y = item.geometry.top.geometry.points[3].y;
                this.line.end.x = item.geometry.top.geometry.points[0].x;
                this.line.end.y = item.geometry.top.geometry.points[0].y;
                this.line.path(gamecanvas);
            }
            if (item.geometry.visible.right.visible) {
                this.line.start.x = item.geometry.top.geometry.points[1].x;
                this.line.start.y = item.geometry.top.geometry.points[1].y;
                this.line.end.x = item.geometry.top.geometry.points[2].x;
                this.line.end.y = item.geometry.top.geometry.points[2].y;
                this.line.path(gamecanvas);
            }
            if (item.geometry.visible.front.visible) {
                this.line.start.x = item.geometry.top.geometry.points[2].x;
                this.line.start.y = item.geometry.top.geometry.points[2].y;
                this.line.end.x = item.geometry.top.geometry.points[3].x;
                this.line.end.y = item.geometry.top.geometry.points[3].y;
                this.line.path(gamecanvas);
            }
        }
        if (frontoutline) {
            if (item.geometry.visible.bottom.visible) {
                this.line.start.x = item.geometry.front.geometry.points[3].x;
                this.line.start.y = item.geometry.front.geometry.points[3].y;
                this.line.end.x = item.geometry.front.geometry.points[2].x;
                this.line.end.y = item.geometry.front.geometry.points[2].y;
                this.line.path(gamecanvas);
            } 
            if (item.geometry.visible.left.visible) {
                this.line.start.x = item.geometry.front.geometry.points[item.geometry.front.geometry.points.length - 1].x;
                this.line.start.y = item.geometry.front.geometry.points[item.geometry.front.geometry.points.length - 1].y;
                this.line.end.x = item.geometry.front.geometry.points[0].x;
                this.line.end.y = item.geometry.front.geometry.points[0].y;
                this.line.path(gamecanvas);
            }
            if (item.geometry.visible.right.visible) {
                this.line.start.x = item.geometry.front.geometry.points[1].x;
                this.line.start.y = item.geometry.front.geometry.points[1].y;
                this.line.end.x = item.geometry.front.geometry.points[2].x;
                this.line.end.y = item.geometry.front.geometry.points[2].y;
                this.line.path(gamecanvas);
            }
        }
        gamecanvas.stroke();
        gamecanvas.commit();
    }
    
    if (debug.hsr) {
        gamecanvas.setAlpha(1);        
        var linecolor = "red";
        if (!item.geometry.visible.front.visible) {
            this.renderItemParts3D(gamecanvas, item, item.geometry.front, linecolor, x, y, scale, debug, true, false, true);
        }
        if (!item.geometry.visible.top.visible) {
            this.renderItemParts3D(gamecanvas, item, item.geometry.top, linecolor, x, y, scale, debug, true, false, true);
        }
        if (!item.geometry.visible.left.visible && item.item3D.left) {
            this.renderItemParts3D(gamecanvas, item, item.geometry.left, linecolor, x, y, scale, debug, true, false, true);
        }
        if (!item.geometry.visible.right.visible && item.item3D.right) {
            this.renderItemParts3D(gamecanvas, item, item.geometry.right, linecolor, x, y, scale, debug, true, false, true);
        }
    }
    
}

ItemRenderer3D.prototype.getColors = function(world, gamecanvas, renderer, item, debug) {
    var dodebug = debug && debug.level;
    if (item.width == "100%" || item.height == "100%" || item.depth == "100%") {
        if (debug.level || debug.render || debug.hsr) {
            this.dotop = true;
            if (debug.level) dodebug = true;
        } else {
            this.dotop = false;
        }
    } else {
        this.dotop = item.top === false ? false : true;
    }
    var theme = (renderer && renderer.theme) ? renderer.theme.items[item.itemtype] : null;
    if (dodebug || !theme){
        this.colors.front = "#dddddd";
        this.colors.side = "#b9b9b9";
        this.colors.top = "#e8e8e8";
        this.colors.bottom = "#c7c7c7";
        if (item.width == "100%") {
            if (item.waterline) {
                this.colors.top = "#8e8e8e";
                this.colors.front = this.colors.top;
            } else  this.colors.front = "white";
        }
    }
    if (!theme) return;
    this.dotop = item.top === false ? false : true;
    if (theme.top === false) this.dotop = false;
    if (dodebug) return;
    var themecolor = "";
    var mat = theme.material;
    if (mat) {
        var mmm = renderer.materials.materials[mat];
        if (mmm) {
            if (mmm.color && mmm.color.projected) {
                themecolor = mmm.color.projected;    
            }
        }
    } else if (theme.color && theme.color.projected) {
        themecolor = theme.color.projected;
    } else if (theme.color) {
        themecolor = theme.color;
        if (theme.color.gradient) {
            var gradient = theme.color.gradient;
            
            var gg = gamecanvas.createLinearGradient(0, 0, 0, item.height);
            gg.addColorStop(0, gradient.start);
            gg.addColorStop(1, gradient.stop);
            
            themecolor = gg;
        }
    }
    if (!themecolor) return;
    if (themecolor.top) this.colors.top = themecolor.top;
    if (themecolor.side) this.colors.side = themecolor.side;
    if (themecolor.bottom) this.colors.bottom = themecolor.bottom;
    this.colors.front = themecolor.front ? themecolor.front : themecolor;
    
    if (this.colors.front.gradient) {
        var gradient = this.colors.front.gradient;
//        var gh = world.bounds.height * item.scale;
        var gh = world.bounds.height;
        var gg = gamecanvas.createLinearGradient(0, 0, 0, gh);
        gg.addColorStop(0, gradient.start);
        gg.addColorStop(1, gradient.stop);
        this.colors.front = gg;
    }
}
    
ItemRenderer3D.prototype.renderItemParts3D = function(gamecanvas, item, geometry, color, x, y, scale, debug, outline = true, fill = true, overridecolor = false) {
    if (!geometry.showing) return;
    gamecanvas.beginPath();
    gamecanvas.setFillStyle(color);
    geometry.geometry.translate(-x, -y, scale);
    geometry.geometry.path(gamecanvas);
    geometry.geometry.translate(x, y, scale);
    if (fill) {
        gamecanvas.fill();
        gamecanvas.commit();
    }
    if (outline || (debug.level && item.draw && item.width != "100%")) {
        if (debug.level && !overridecolor) color="gray";
        gamecanvas.setStrokeStyle(color);
        gamecanvas.setLineWidth(1 * scale);
        gamecanvas.stroke();
        gamecanvas.commit();
    }
}