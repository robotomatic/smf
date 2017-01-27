"use strict";

// todo: need to store object keys for items and theme items...

function ItemRenderer(theme) {
    this.theme = theme;
    this.outlinecolor = "#424242";
    this.outlinewidth = 2;
    this.outlineopacity = null;
    
    this.cloudsrenderer = new ItemRendererClouds();
    this.wavesrenderer = new ItemRendererWaves();
    this.flagsrenderer = new ItemRendererFlag();
    this.scaffoldrenderer = new ItemRendererScaffold();
    this.woodrenderer = new ItemRendererWood();
    this.groundrenderer = new ItemRendererGround();
    this.grassrenderer = new ItemRendererGrass();
    this.bushrenderer = new ItemRendererBush();
    this.rockrenderer = new ItemRendererRock();
    this.treerenderer = new ItemRendererTree();
    this.metalrenderer = new ItemRendererMetal();
    this.starsrenderer = new ItemRendererStars();
    

    this.gearsrenderer = new ItemRendererGears();
    
    this.pcanvas = null;
    this.patterns = new Array();
}

ItemRenderer.prototype.drawItem = function(ctx, color, item, x, y, width, height, scale, drawdetails) {

    if (item.draw == false) return;
    if (!scale) scale = 1;
    
    if (!this.theme) {
        ctx.fillStyle = color ? color : "blue";
        if (item.angle) {
            ctx.save();
            ctx.translate(x + width / 2, y + height / 2);
            var rad = item.angle * Math.PI / 180;
            ctx.rotate(rad);
            x = -width / 2;
            y = -height / 2;
        }
        drawShape(ctx, item, x, y, width, height, scale);
        if (item.angle) ctx.restore();
        return; 
    }
    
    var titem = this.theme.items[String(item.itemtype)];
    if (!titem) {
        ctx.fillStyle = color ? color : item.color ? item.color : "purple";
        if (item.angle) {
            ctx.save();
            ctx.translate(x + width / 2, y + height / 2);
            var rad = item.angle * Math.PI / 180;
            ctx.rotate(rad);
            x = -width / 2;
            y = -height / 2;
        }
        drawShape(ctx, item, x, y, width, height, scale);
        if (item.angle) ctx.restore();
        return; 
    }
    
    if (titem.draw === false) return;
    
    if (item.angle) {
        titem.angle = item.angle;
    }

    if (titem.tile && this.patterns[titem.name]) {
        
        if (titem.tilewidth * scale < 1) {
            
            return;
        }
        
        ctx.fillStyle = this.patterns[titem.name];
        drawShape(ctx, item, x, y, width * scale, height * scale, scale);        
        return;
    }
    
    // todo: this is gross.
    var renderer = titem.renderer;
    if (renderer) {
        if (renderer == "stars") this.starsrenderer.drawStars(ctx, item, x, y, width, height, scale, titem);
        else if (renderer == "scaffold") this.scaffoldrenderer.drawSupport(ctx, item, x, y, width, height, titem, drawdetails);
        else if (renderer == "wood") this.woodrenderer.drawSupport(ctx, item, x, y, width, height, titem, drawdetails);
        else if (renderer == "ground") this.groundrenderer.drawPlatform(ctx, item, x, y, width, height, scale, titem, drawdetails);
        else if (renderer == "ground-bg") this.groundrenderer.drawPlatformBg(ctx, item, x, y, width, height, scale, titem, drawdetails);
        else if (renderer == "grass") this.grassrenderer.drawGrass(ctx, item, x, y, width, height, scale, titem, drawdetails);
        else if (renderer == "bush") this.bushrenderer.drawBush(ctx, item, x, y, width, height, scale, titem, drawdetails);
        else if (renderer == "rock") this.rockrenderer.drawRock(ctx, item, x, y, width, height, scale, titem, drawdetails);
        else if (renderer == "tree") this.treerenderer.drawPlatform(ctx, item, x, y, width, height, scale, titem, drawdetails);
        else if (renderer == "metal") this.metalrenderer.drawPlatform(ctx, item, x, y, width, height, scale, titem, drawdetails);

        else if (renderer == "gear") this.gearsrenderer.drawGear(ctx, item, x, y, width, height, titem, drawdetails);

        else if (renderer == "clouds" || renderer == "fog") this.cloudsrenderer.drawClouds(ctx, item, x, y, width, height, scale, titem);
        else if (renderer == "wave") this.wavesrenderer.drawWaves(ctx, titem.color, item, x, y, width, height, scale, titem);
        else if (renderer == "flag") this.flagsrenderer.drawFlag(ctx, item, x, y, width, height, scale, titem);
        
        
        if (titem.parts) {
            var keys = Object.keys(titem.parts);
            for (var i = 0; i < keys.length; i++) {
                var p = keys[i];
                var pp = titem.parts[p];
                if (!pp.id) pp.id = item.id + "_" + pp.itemtype;
                this.drawItem(ctx, color, pp, x, y, width, height, scale, drawdetails);            
            }
        }
        return;
    }
    
    
    titem.ramp = (item.ramp) ? item.ramp : "";

    var ox = x;
    var oy = y;
    var ow = width;
    var oh = height;
    var octx = ctx;
    
    if (titem.tile) {
        x = 0;
        y = 0;
        width = titem.tilewidth * scale;
        height = titem.tileheight * scale;
        if (!this.pcanvas) {
            this.pcanvas = document.createElement('canvas');
        }
        this.pcanvas.width = width;
        this.pcanvas.height = height;
        ctx = this.pcanvas.getContext("2d");
    }
    
    
    
    
    color = titem.color;
    if (color) {
        if (color.gradient && height > 0) {
            var gradient = color.gradient;
            var g = ctx.createLinearGradient(0, y, 0, height + y);
            var start = gradient.start;
            var stop = gradient.stop;
            g.addColorStop(0, start);
            g.addColorStop(1, stop);
            color = g;
        }
    } else  color = color ? color : "magenta";
    
    
    if (titem.parts) {
        var keys = Object.keys(titem);
        var bitem = [];
        for (var n = keys.length; n--;) bitem[keys[n]] = titem[keys[n]];
        
        if (item.draw != false) {
            this.drawItemParts(ctx, bitem.parts, x, y, width, height, color, scale, item.angle);
        }
        
        if (item.parts) {
            
            
            
            // here -> need to see if item parts have a theme
            
            
            
            
            this.drawItem(ctx, color, item.parts, x, y, width, height, scale);
        }
    } else {
        if (item.draw != false) {
            ctx.fillStyle = color;
            
            if (item.angle) {
                ctx.save();
                ctx.translate(x + width / 2, y + height / 2);
                var rad = item.angle * Math.PI / 180;
                ctx.rotate(rad);
                x = -width / 2;
                y = -height / 2;
                drawShape(ctx, titem, x, y, width, height, scale);
                ctx.restore();
            } else {
                drawShape(ctx, titem, x, y, width, height, scale);
            }
        }
        
        if (item.parts) {
            
            var keys = Object.keys(item.parts);
            for (var i = 0; i < keys.length; i++) {
                var p = keys[i];
                var pp = item.parts[p];
                if (pp.width && pp.height) {
                    
                    if (!pp.id) pp.id = item.id + "_"  + p;
                    
                    width = pp.width * scale;
                    height = pp.height * scale;
                    var px = x + pp.x * scale;
                    var py = y + pp.y * scale;
                    
                    
                    if (item.action) {
                        var speed;
                        if (item.velx != 0) speed = item.velx;
                        if (item.vely != 0) speed = -item.vely * 2;
                        
                        if (pp.actions) {
                            for (var ii = 0; ii < pp.actions.length; ii++) {
                                if (pp.actions[ii].rotate != "") pp.actions[ii].rotate = speed;
                            }
                        }
                    }

                    this.drawItem(ctx, color, pp, px, py, width, height, scale);
                }
            }
        }
    }
    
    
    if (titem.tile) {
        var newpat = octx.createPattern(this.pcanvas, "repeat");
        this.patterns[titem.name] = newpat;    
        
        
        if (titem.tilewidth * scale < 1) {
            
            return;
        }
        
        
        octx.fillStyle = newpat;
        drawShape(octx, item, ox, oy, ow, oh, scale);        
    }
    
}

ItemRenderer.prototype.drawItemParts = function(ctx, parts, x, y, width, height, color, scale, angle) { 
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
         var part = keys[i];
         this.drawItemPart(ctx, parts[part], x, y, width, height, color, scale, angle);
    }
}

ItemRenderer.prototype.drawItemPart = function(ctx, part, x, y, width, height, color, scale, angle) {
    if (part.height && part.width) this.drawPart(ctx, part, x, y, width, height, color, scale, angle);
    if (part.parts) {
        color = (part.color) ? part.color : color;
        this.drawItemParts(ctx, part.parts, x, y, width, height, color, scale, angle);
    }
}

ItemRenderer.prototype.drawPart = function(ctx, part, x, y, width, height, color, scale, angle) {

    var pw = width;
    var ph = height;
    
    var pad = .8;

//    var part_x = x + (pw * ((part.x - (pad / 2)) / 100));
//    var part_y = y + (ph * ((part.y - (pad / 2)) / 100));
//    var part_width = pw * ((part.width + pad) / 100);
//    var part_height = ph * ((part.height + pad) / 100);
    
    var part_x = clamp(x + (pw * ((part.x - (pad / 2)) / 100)));
    var part_y = clamp(y + (ph * ((part.y - (pad / 2)) / 100)));
    var part_width = clamp(pw * ((part.width + pad) / 100));
    var part_height = clamp(ph * ((part.height + pad) / 100));
    
    var c;
    
    if (part.actions) {
        var actionnum = part.actionnum;
        if (!part.currentcolor) {
            part.actionnum = 0;
            actionnum = 0;
            part.currentcolor = color;
        }
        var action = part.actions[actionnum];
        if (action && action.color) {
            
            
            //  todo: animate gradient here!!!!!
            
            
            var steps = action.steps;
            var cs = part.colorstep;
            if (!cs) {
                part.colorstep = 1;
                cs = 1;
            }
            var ratio = cs / steps;
            color = fadeToColor(part.currentcolor, action.color, ratio);
            if (cs == action.steps) {
                part.currentcolor = action.color;
                if (actionnum < part.actions.length - 1) part.actionnum = part.actionnum + 1;
                else part.actionnum = 0;
                part.colorstep = 1;
            } else {
                part.colorstep = part.colorstep + 1;
            }
        }
    }

    
    
    
    
    if (angle || part.angle) {
        ctx.save();
        ctx.translate(part_x + part_width / 2, part_y + part_height / 2);
        var rad = clamp(part.angle * Math.PI / 180);
        ctx.rotate(rad);
        part_x = clamp(-part_width / 2);
        part_y = clamp(-part_height / 2);
    }
    
    c = part.color ? part.color : color;
    if (c) {
        if (c.gradient) {
            var gradient = c.gradient;
            var g = ctx.createLinearGradient(0, part_y, 0, part_height + part_y);
            var start = gradient.start;
            var stop = gradient.stop;
            g.addColorStop(0, start);
            g.addColorStop(1, stop);
            c = g;
        }
    }

    ctx.fillStyle = c;
    drawShape(ctx, part, part_x, part_y, part_width, part_height, scale);
    
    if (part.angle) {
        ctx.restore();
    }
}