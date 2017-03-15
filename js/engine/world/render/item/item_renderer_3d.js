"use strict";

function ItemRenderer3D() {
    this.polygon = new Polygon();
    this.colors = {
        front : "red",
        side : "red",
        top : "white",
        bottom : "blue"
    }
    this.dotop = false;
    this.fadepercent = 0.6;
}

ItemRenderer3D.prototype.renderItem3D = function(now, renderer, item, ctx, scale, debug) {

    if (item.width == "100%") {
        if (debug.level || debug.render || debug.hsr) return;
    }
    
    if (!renderer.shouldThemeProject(item)) return;
    if (item.draw == false) return;

    if (debug.hsr) {
        ctx.globalAlpha = this.fadepercent;
    }
    
    this.getColors(renderer, item, debug);
    
    var x = item.projectedlocation.x;
    var y = item.projectedlocation.y;

    if (item.item3D.dopoly && item.geometry.visible.front.visible) {
        this.polygon.setPoints(item.geometry.projected.points);
        this.polygon.translate(-x, -y, scale);
        ctx.fillStyle = this.colors.top;
        ctx.strokeStyle = this.colors.top;
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.polygon.path(ctx);
        ctx.fill();
        ctx.stroke();
    }

    if (item.geometry.visible.front.visible) {
        //
        // todo: this can eventually go -- item cache will draw fronts
        //
        this.renderItemParts3D(ctx, item, item.geometry.fronts, this.colors.front, x, y, scale, debug);
        
        if (!debug.level) {
            var lc = this.colors.side;
            var lw = 1;
            ctx.strokeStyle = lc;
            ctx.lineWidth = lw;
            ctx.beginPath();
            if (item.geometry.visible.left.visible) {
                if (item.item3D.polygon.points.length >= 4) {
                    item.item3D.line.start.x = item.item3D.polygon.points[3].x;
                    item.item3D.line.start.y = item.item3D.polygon.points[3].y;
                    item.item3D.line.end.x = item.item3D.polygon.points[0].x;
                    item.item3D.line.end.y = item.item3D.polygon.points[0].y;
                    item.item3D.line.path(ctx);
                }
            }
            if (item.geometry.visible.right.visible) {
                if (item.item3D.polygon.points.length >= 3) {
                    item.item3D.line.start.x = item.item3D.polygon.points[1].x;
                    item.item3D.line.start.y = item.item3D.polygon.points[1].y;
                    item.item3D.line.end.x = item.item3D.polygon.points[2].x;
                    item.item3D.line.end.y = item.item3D.polygon.points[2].y;
                    item.item3D.line.path(ctx);
                }
            }
            ctx.stroke();
        }
    }
    
    if (item.geometry.visible.left.visible || item.geometry.visible.right.visible) {
        if (item.geometry.sides.length && item.geometry.sides[0].points.length) {
            var left = item.item3D.left && item.geometry.visible.left.visible;
            var right = item.item3D.right && item.geometry.visible.right.visible;
            var sides = left || right;
            if (sides) {
                this.renderItemParts3D(ctx, item, item.geometry.sides, this.colors.side, x, y, scale, debug);
            }
        }
    }
    
    if (item.bottom === true) {
        if (item.geometry.visible.bottom.visible) {
            this.renderItemParts3D(ctx, item, item.geometry.bottoms, this.colors.bottom, x, y, scale, debug);
        }
    }
    
    if (this.dotop) {
        if (item.geometry.visible.top.visible) {
            
            var outline = true;
            var dt = true;
            // todo: only draw outline on contiguous surfaces - tile of same type must exist on outline side
            
            this.renderItemParts3D(ctx, item, item.geometry.tops, this.colors.top, x, y, scale, debug, outline, dt);
            
            if (!debug.level) {
                var lc = this.colors.side;
                var lw = 1;
                ctx.strokeStyle = lc;
                ctx.lineWidth = lw;
                ctx.beginPath();

                if (item.geometry.visible.left.visible) {
                    if (item.item3D.polygon.points.length >= 4) {
                        item.item3D.line.start.x = item.item3D.polygon.points[3].x;
                        item.item3D.line.start.y = item.item3D.polygon.points[3].y;
                        item.item3D.line.end.x = item.item3D.polygon.points[0].x;
                        item.item3D.line.end.y = item.item3D.polygon.points[0].y;
                        item.item3D.line.path(ctx);
                    }
                }

                if (item.geometry.visible.right.visible) {
                    if (item.item3D.polygon.points.length >= 3) {
                        item.item3D.line.start.x = item.item3D.polygon.points[1].x;
                        item.item3D.line.start.y = item.item3D.polygon.points[1].y;
                        item.item3D.line.end.x = item.item3D.polygon.points[2].x;
                        item.item3D.line.end.y = item.item3D.polygon.points[2].y;
                        item.item3D.line.path(ctx);
                    }
                }

                if (item.geometry.visible.back.visible) {
                    if (item.item3D.polygon.points.length >= 2) {
                        item.item3D.line.start.x = item.item3D.polygon.points[0].x;
                        item.item3D.line.start.y = item.item3D.polygon.points[0].y;
                        item.item3D.line.end.x = item.item3D.polygon.points[1].x;
                        item.item3D.line.end.y = item.item3D.polygon.points[1].y;
                        item.item3D.line.path(ctx);
                    }
                } 
                ctx.stroke();

                if (item.item3D.dopoly && !item.geometry.visible.front.visible) {
                    if (item.item3D.polygon.points.length >= 4) {
                        item.item3D.line.start.x = item.item3D.polygon.points[2].x;
                        item.item3D.line.start.y = item.item3D.polygon.points[2].y;
                        item.item3D.line.end.x = item.item3D.polygon.points[3].x;
                        item.item3D.line.end.y = item.item3D.polygon.points[3].y;
                        ctx.strokeStyle = this.colors.top;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        item.item3D.line.draw(ctx);
                    }
                }
            }
        }
    }
    
    
    if (debug.hsr) {
        ctx.globalAlpha = 1;        
        var linecolor = "red";
        if (!item.geometry.visible.front.visible) {
            this.renderItemParts3D(ctx, item, item.geometry.fronts, linecolor, x, y, scale, debug, true, false);
        }
        if (!item.geometry.visible.top.visible) {
            this.renderItemParts3D(ctx, item, item.geometry.tops, linecolor, x, y, scale, debug, true, false);
        }
        if (!item.geometry.visible.left.visible && item.item3D.left) {
            this.renderItemParts3D(ctx, item, item.geometry.sides, linecolor, x, y, scale, debug, true, false);
        }
        if (!item.geometry.visible.right.visible && item.item3D.right) {
            this.renderItemParts3D(ctx, item, item.geometry.sides, linecolor, x, y, scale, debug, true, false);
        }
    }
    
}

ItemRenderer3D.prototype.getColors = function(renderer, item, debug) {

    var dodebug = debug && debug.level;
    
    if (dodebug){
        this.colors.front = "#ededed";
        this.colors.side = "#d3d3d3";
        this.colors.top = "#dbdbdb";
        this.colors.bottom = "#c7c7c7";
    }

    var theme = (renderer && renderer.theme) ? renderer.theme.items[item.itemtype] : null;
    if (!theme) return;
    
    this.dotop = item.top === false ? false : true;
    if (theme.top === false) this.dotop = false;
    
    if (dodebug) return;
    
    var themecolor = "red";
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
    }
    if (!themecolor) return;
    
    if (themecolor.top) this.colors.top = themecolor.top;
    if (themecolor.side) this.colors.side = themecolor.side;
    if (themecolor.bottom) this.colors.bottom = themecolor.bottom;
    this.colors.front = themecolor.front ? themecolor.front : this.colors.side;
}
    
ItemRenderer3D.prototype.renderItemParts3D = function(ctx, item, parts, color, x, y, scale, debug, outline = true, fill = true) {
    ctx.beginPath();
    ctx.fillStyle = color;
    var t = parts.length;
    for (var i = 0; i < t; i++) {
        var p = parts[i];
        item.item3D.polygon.setPoints(p.points);
        item.item3D.polygon.translate(-x, -y, scale);
        item.item3D.polygon.path(ctx);
    }
    if (fill) ctx.fill();
    if (outline || debug.level) {
        ctx.strokeStyle = debug.level ? "gray" : color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}