"use strict";

function Item3DRenderer(item3d) {
    this.item3d = item3d;
    this.colors = {
        front : "red",
        side : "red",
        top : "white",
        bottom : "blue"
    }
    this.dotop = false;
    this.fadepercent = 0.6;
}

Item3DRenderer.prototype.renderItem3D = function(now, renderer, ctx, scale, debug) {

    if (this.item3d.item.width == "100%") {
        if (debug.level || debug.render || debug.hsr) return;
    }
    
    if (!renderer.shouldThemeProject(this.item3d.item)) return;
    if (this.item3d.item.draw == false) return;

    if (debug.hsr) {
        ctx.globalAlpha = this.fadepercent;
    }
    
    this.getColors(renderer, debug);
    
    var x = this.item3d.item.projectedlocation.x;
    var y = this.item3d.item.projectedlocation.y;

    if (this.item3d.dopoly && this.item3d.item.geometry.visible.front.visible) {
        this.item3d.polygon.setPoints(this.item3d.item.geometry.projected.points);
        this.item3d.polygon.translate(-x, -y, scale);
        ctx.fillStyle = this.colors.top;
        ctx.strokeStyle = this.colors.top;
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.item3d.polygon.path(ctx);
        ctx.fill();
        ctx.stroke();
    }

    if (this.item3d.item.geometry.visible.front.visible) {
        //
        // todo: this can eventually go -- item cache will draw fronts
        //
        this.renderItemParts3D(ctx, this.item3d.item.geometry.fronts, this.colors.front, x, y, scale, debug);
        
        if (!debug.level) {
            var lc = this.colors.side;
            var lw = 1;
            ctx.strokeStyle = lc;
            ctx.lineWidth = lw;
            ctx.beginPath();
            if (this.item3d.item.geometry.visible.left.visible) {
                if (this.item3d.polygon.points.length >= 4) {
                    this.item3d.line.start.x = this.item3d.polygon.points[3].x;
                    this.item3d.line.start.y = this.item3d.polygon.points[3].y;
                    this.item3d.line.end.x = this.item3d.polygon.points[0].x;
                    this.item3d.line.end.y = this.item3d.polygon.points[0].y;
                    this.item3d.line.path(ctx);
                }
            }
            if (this.item3d.item.geometry.visible.right.visible) {
                if (this.item3d.polygon.points.length >= 3) {
                    this.item3d.line.start.x = this.item3d.polygon.points[1].x;
                    this.item3d.line.start.y = this.item3d.polygon.points[1].y;
                    this.item3d.line.end.x = this.item3d.polygon.points[2].x;
                    this.item3d.line.end.y = this.item3d.polygon.points[2].y;
                    this.item3d.line.path(ctx);
                }
            }
            ctx.stroke();
        }
    }
    
    if (this.item3d.item.geometry.visible.left.visible || this.item3d.item.geometry.visible.right.visible) {
        if (this.item3d.item.geometry.sides.length && this.item3d.item.geometry.sides[0].points.length) {
            var sides = ((this.item3d.left && this.item3d.item.geometry.visible.left.visible) || (this.item3d.right && this.item3d.item.geometry.visible.right.visible));
            if (sides) {
                this.renderItemParts3D(ctx, this.item3d.item.geometry.sides, this.colors.side, x, y, scale, debug);
            }
        }
    }
    
    if (this.item3d.item.bottom === true) {
        if (this.item3d.item.geometry.visible.bottom.visible) {
            this.renderItemParts3D(ctx, this.item3d.item.geometry.bottoms, this.colors.bottom, x, y, scale, debug);
        }
    }
    
    if (this.dotop) {
        if (this.item3d.item.geometry.visible.top.visible) {
            
            var outline = true;
            var dt = true;
            // todo: only draw outline on contiguous surfaces - tile of same type must exist on outline side
            
            this.renderItemParts3D(ctx, this.item3d.item.geometry.tops, this.colors.top, x, y, scale, debug, outline, dt);
            
            if (!debug.level) {
                var lc = this.colors.side;
                var lw = 1;
                ctx.strokeStyle = lc;
                ctx.lineWidth = lw;
                ctx.beginPath();

                if (this.item3d.item.geometry.visible.left.visible) {
                    if (this.item3d.polygon.points.length >= 4) {
                        this.item3d.line.start.x = this.item3d.polygon.points[3].x;
                        this.item3d.line.start.y = this.item3d.polygon.points[3].y;
                        this.item3d.line.end.x = this.item3d.polygon.points[0].x;
                        this.item3d.line.end.y = this.item3d.polygon.points[0].y;
                        this.item3d.line.path(ctx);
                    }
                }

                if (this.item3d.item.geometry.visible.right.visible) {
                    if (this.item3d.polygon.points.length >= 3) {
                        this.item3d.line.start.x = this.item3d.polygon.points[1].x;
                        this.item3d.line.start.y = this.item3d.polygon.points[1].y;
                        this.item3d.line.end.x = this.item3d.polygon.points[2].x;
                        this.item3d.line.end.y = this.item3d.polygon.points[2].y;
                        this.item3d.line.path(ctx);
                    }
                }

                if (this.item3d.item.geometry.visible.back.visible) {
                    if (this.item3d.polygon.points.length >= 2) {
                        this.item3d.line.start.x = this.item3d.polygon.points[0].x;
                        this.item3d.line.start.y = this.item3d.polygon.points[0].y;
                        this.item3d.line.end.x = this.item3d.polygon.points[1].x;
                        this.item3d.line.end.y = this.item3d.polygon.points[1].y;
                        this.item3d.line.path(ctx);
                    }
                } 
                ctx.stroke();

                if (this.item3d.dopoly && !this.item3d.item.geometry.visible.front.visible) {
                    if (this.item3d.polygon.points.length >= 4) {
                        this.item3d.line.start.x = this.item3d.polygon.points[2].x;
                        this.item3d.line.start.y = this.item3d.polygon.points[2].y;
                        this.item3d.line.end.x = this.item3d.polygon.points[3].x;
                        this.item3d.line.end.y = this.item3d.polygon.points[3].y;
                        ctx.strokeStyle = this.colors.top;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        this.item3d.line.draw(ctx);
                    }
                }
            }
        }
    }
    
    
    if (debug.hsr) {
        ctx.globalAlpha = 1;        
        var linecolor = "red";
        if (!this.item3d.item.geometry.visible.front.visible) {
            this.renderItemParts3D(ctx, this.item3d.item.geometry.front, linecolor, x, y, scale, debug, true, false);
        }
        if (!this.item3d.item.geometry.visible.top.visible) {
            this.renderItemParts3D(ctx, this.item3d.item.geometry.tops, linecolor, x, y, scale, debug, true, false);
        }
        if (!this.item3d.item.geometry.visible.left.visible && this.item3d.left) {
            this.renderItemParts3D(ctx, this.item3d.item.geometry.sides, linecolor, x, y, scale, debug, true, false);
        }
        if (!this.item3d.item.geometry.visible.right.visible && this.item3d.right) {
            this.renderItemParts3D(ctx, this.item3d.item.geometry.sides, linecolor, x, y, scale, debug, true, false);
        }
    }
    
}

Item3DRenderer.prototype.getColors = function(renderer, debug) {

    var dodebug = debug && debug.level;
    
    if (dodebug){
        this.colors.front = "white";
        this.colors.side = "#d3d3d3";
        this.colors.top = "#dbdbdb";
        this.colors.bottom = "#c7c7c7";
    }

    var theme = (renderer && renderer.theme) ? renderer.theme.items[this.item3d.item.itemtype] : null;
    if (!theme) return;
    
    this.dotop = this.item3d.item.top === false ? false : true;
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
    
Item3DRenderer.prototype.renderItemParts3D = function(ctx, parts, color, x, y, scale, debug, outline = true, fill = true) {
    ctx.beginPath();
    ctx.fillStyle = color;
    var t = parts.length;
    for (var i = 0; i < t; i++) {
        var p = parts[i];
        this.item3d.polygon.setPoints(p.points);
        this.item3d.polygon.translate(-x, -y, scale);
        this.item3d.polygon.path(ctx);
    }
    if (fill) ctx.fill();
    if (outline || debug.level) {
        ctx.strokeStyle = debug.level ? "gray" : color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}