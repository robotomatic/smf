"use strict";

function ItemRenderer3D() {
    this.polygon = new Polygon();
    this.colors = {
        front : "#dedede",
        side : "#d6d6d6",
        top : "#e8e8e8",
        bottom : "#cccccc"
    }
    this.dotop = false;
    this.fadepercent = 0.6;
}

ItemRenderer3D.prototype.renderItem3D = function(now, renderer, item, gamecanvas, scale, debug) {

    var dodebug = (debug.level || debug.render || debug.hsr);
    
    if (!renderer.shouldThemeProject(item)) return;
//    if (item.draw == false) return;

    if (debug.hsr) {
        gamecanvas.setAlpha(this.fadepercent);
    }
    
    this.getColors(gamecanvas, renderer, item, debug);
    
    var x = item.projectedlocation.x;
    var y = item.projectedlocation.y;

    var fill = item.draw === false ? false : true;
    var outline = fill ? true : dodebug ? true : false;
    
    if (item.geometry.visible.front.visible) {
        //
        // todo: this can eventually go -- item cache will draw fronts
        //
 
        this.renderItemParts3D(gamecanvas, item, item.geometry.fronts, this.colors.front, x, y, scale, debug, outline, fill);
        
        if (!debug.level && fill) {
            var lc = this.colors.side;
            var lw = 1;
            gamecanvas.setStrokeStyle(lc);
            gamecanvas.setLineWidth(lw);
            gamecanvas.beginPath();
            if (item.geometry.visible.left.visible) {
                if (item.item3D.polygon.points.length >= 4) {
                    item.item3D.line.start.x = item.item3D.polygon.points[3].x;
                    item.item3D.line.start.y = item.item3D.polygon.points[3].y;
                    item.item3D.line.end.x = item.item3D.polygon.points[0].x;
                    item.item3D.line.end.y = item.item3D.polygon.points[0].y;
                    item.item3D.line.path(gamecanvas);
                }
            }
            if (item.geometry.visible.right.visible) {
                if (item.item3D.polygon.points.length >= 3) {
                    item.item3D.line.start.x = item.item3D.polygon.points[1].x;
                    item.item3D.line.start.y = item.item3D.polygon.points[1].y;
                    item.item3D.line.end.x = item.item3D.polygon.points[2].x;
                    item.item3D.line.end.y = item.item3D.polygon.points[2].y;
                    item.item3D.line.path(gamecanvas);
                }
            }
            gamecanvas.stroke();
        }
    }
    
    if (item.geometry.visible.left.visible || item.geometry.visible.right.visible) {
        if (item.geometry.sides.length && item.geometry.sides[0].points.length) {
            var left = item.item3D.left && item.geometry.visible.left.visible;
            var right = item.item3D.right && item.geometry.visible.right.visible;
            var sides = left || right;
            if (sides) {
                this.renderItemParts3D(gamecanvas, item, item.geometry.sides, this.colors.side, x, y, scale, debug, outline, fill);
            }
        }
    }
    
    if (item.bottom === true) {
        if (item.geometry.visible.bottom.visible) {
            this.renderItemParts3D(gamecanvas, item, item.geometry.bottoms, this.colors.bottom, x, y, scale, debug, outline, fill);
        }
    }
    
    if (this.dotop) {
        if (item.geometry.visible.top.visible) {
            
            var topoutline = true;
            if (item.draw === false) topoutline = false;
            if (item.width == "100%") {
                if (dodebug) topoutline = true;
            }
            // todo: only draw outline on contiguous surfaces - tile of same type must exist on outline side
            
            this.renderItemParts3D(gamecanvas, item, item.geometry.tops, this.colors.top, x, y, scale, debug, topoutline, fill);
            
            if (fill && !debug.level && item.width != "100%") {
                var lc = this.colors.side;
                var lw = 1;
                gamecanvas.setStrokeStyle(lc);
                gamecanvas.setLineWidth(lw);
                gamecanvas.beginPath();

                if (item.geometry.visible.left.visible) {
                    if (item.item3D.polygon.points.length >= 4) {
                        item.item3D.line.start.x = item.item3D.polygon.points[3].x;
                        item.item3D.line.start.y = item.item3D.polygon.points[3].y;
                        item.item3D.line.end.x = item.item3D.polygon.points[0].x;
                        item.item3D.line.end.y = item.item3D.polygon.points[0].y;
                        item.item3D.line.path(gamecanvas);
                    }
                }

                if (item.geometry.visible.right.visible) {
                    if (item.item3D.polygon.points.length >= 3) {
                        item.item3D.line.start.x = item.item3D.polygon.points[1].x;
                        item.item3D.line.start.y = item.item3D.polygon.points[1].y;
                        item.item3D.line.end.x = item.item3D.polygon.points[2].x;
                        item.item3D.line.end.y = item.item3D.polygon.points[2].y;
                        item.item3D.line.path(gamecanvas);
                    }
                }

                if (item.geometry.visible.back.visible) {
                    if (item.item3D.polygon.points.length >= 2) {
                        item.item3D.line.start.x = item.item3D.polygon.points[0].x;
                        item.item3D.line.start.y = item.item3D.polygon.points[0].y;
                        item.item3D.line.end.x = item.item3D.polygon.points[1].x;
                        item.item3D.line.end.y = item.item3D.polygon.points[1].y;
                        item.item3D.line.path(gamecanvas);
                    }
                } 
                gamecanvas.stroke();

                if (item.item3D.dopoly && !item.geometry.visible.front.visible) {
                    if (item.item3D.polygon.points.length >= 4) {
                        item.item3D.line.start.x = item.item3D.polygon.points[2].x;
                        item.item3D.line.start.y = item.item3D.polygon.points[2].y;
                        item.item3D.line.end.x = item.item3D.polygon.points[3].x;
                        item.item3D.line.end.y = item.item3D.polygon.points[3].y;
                        gamecanvas.setStrokeStyle(this.colors.top);
                        gamecanvas.setLineWidth(1);
                        gamecanvas.beginPath();
                        item.item3D.line.draw(gamecanvas);
                    }
                }
            }
        }
    }
    
    
    if (debug.hsr) {
        gamecanvas.setAlpha(1);        
        var linecolor = "red";
        if (!item.geometry.visible.front.visible) {
            this.renderItemParts3D(gamecanvas, item, item.geometry.fronts, linecolor, x, y, scale, debug, true, false);
        }
        if (!item.geometry.visible.top.visible) {
            this.renderItemParts3D(gamecanvas, item, item.geometry.tops, linecolor, x, y, scale, debug, true, false);
        }
        if (!item.geometry.visible.left.visible && item.item3D.left) {
            this.renderItemParts3D(gamecanvas, item, item.geometry.sides, linecolor, x, y, scale, debug, true, false);
        }
        if (!item.geometry.visible.right.visible && item.item3D.right) {
            this.renderItemParts3D(gamecanvas, item, item.geometry.sides, linecolor, x, y, scale, debug, true, false);
        }
    }
    
}

ItemRenderer3D.prototype.getColors = function(gamecanvas, renderer, item, debug) {

    var dodebug = debug && debug.level;
    
    if (dodebug){
        this.colors.front = "#ededed";
        this.colors.side = "#d3d3d3";
        this.colors.top = "#dbdbdb";
        this.colors.bottom = "#c7c7c7";
    }

    if (item.width == "100%" || item.height == "100%" || item.depth == "100%") {
        if (debug.level || debug.render || debug.hsr) {
            this.dotop = true;
        } else {
            this.dotop = false;
        }
    } else {
        this.dotop = item.top === false ? false : true;
    }
    
    var theme = (renderer && renderer.theme) ? renderer.theme.items[item.itemtype] : null;
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
            themecolor = gradient.stop;
            
            /*
            var t = gradient.top ? gradient.top : item.box.y;
            var h = gradient.height ? gradient.height : item.box.height;

            var g = gamecanvas.createLinearGradient(0, t, 0, h + t);
            
            var start = gradient.start;
            var stop = gradient.stop;
            g.addColorStop(0, start);
            g.addColorStop(1, stop);
            themecolor = g;
            */
        }
    }
    if (!themecolor) return;
    
    if (themecolor.top) this.colors.top = themecolor.top;
    if (themecolor.side) this.colors.side = themecolor.side;
    if (themecolor.bottom) this.colors.bottom = themecolor.bottom;
    this.colors.front = themecolor.front ? themecolor.front : themecolor;
}
    
ItemRenderer3D.prototype.renderItemParts3D = function(gamecanvas, item, parts, color, x, y, scale, debug, outline = true, fill = true) {
    gamecanvas.beginPath();
    gamecanvas.setFillStyle(color);
    var t = parts.length;
    for (var i = 0; i < t; i++) {
        var p = parts[i];
        item.item3D.polygon.setPoints(p.points);
        item.item3D.polygon.translate(-x, -y, scale);
        item.item3D.polygon.path(gamecanvas);
    }
    if (fill) gamecanvas.fill();
    if (outline || debug.level) {
        gamecanvas.setStrokeStyle(debug.level ? "gray" : color);
        gamecanvas.setLineWidth(1);
        gamecanvas.stroke();
    }
}