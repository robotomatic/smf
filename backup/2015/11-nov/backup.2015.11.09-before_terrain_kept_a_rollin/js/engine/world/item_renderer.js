function ItemRenderer(theme) {
    this.theme = theme;
    this.outlinecolor = "#424242";
    this.outlinewidth = 2;
    this.outlineopacity = null;

    this.itemanimator = new ItemAnimator();
    
    this.cloudsrenderer = new Array();
    this.wavesrenderer = new Array();
    this.flagsrenderer = new Array();
    
    this.scaffoldrenderer = new ItemRendererScaffold();
    this.woodrenderer = new ItemRendererWood();
    
    this.gearsrenderer = new ItemRendererGears();
    
    this.starsrenderer = new ItemRendererStars();
}

ItemRenderer.prototype.drawItem = function(ctx, color, item, x, y, width, height, lighten, outline, outlinewidth, scale, drawdetails) {

    if (item.actions) {
        this.itemanimator.animate(1, item);
    }
    
    if (!this.theme) {
        ctx.fillStyle = color ? color : "magenta";
        drawRect(ctx, x, y, width, height);
        return; 
    }
    
    var titem = this.theme.items[String(item.itemtype)];
    if (!titem) {
        ctx.fillStyle = color ? color : "purple";
        drawRect(ctx, x, y, width, height);
        return; 
    }
    
    if (titem.draw === false) return;
    
    if (item.itemtype == "wave" || item.itemtype == "wave-1") {
        if (!this.wavesrenderer[item.name]) this.wavesrenderer[item.name] = new ItemRendererWaves();
        this.wavesrenderer[item.name].drawWaves(ctx, titem.color, item, x, y, width, height, lighten, outline, outlinewidth, scale, titem);
        return;
    } else if (item.itemtype == "gear") {
        this.gearsrenderer.drawGear(ctx, item, x, y, width, height, titem, drawdetails);
        return;
    } else if (item.itemtype == "clouds" || item.itemtype == "clouds-fg") {
        if (!this.cloudsrenderer[item.name]) this.cloudsrenderer[item.name] = new ItemRendererClouds();
        this.cloudsrenderer[item.name].drawClouds(ctx, item, x, y, width, height, scale, titem);
        return;
    } else if (item.itemtype == "stars") {
        this.starsrenderer.drawStars(ctx, item, x, y, width, height, scale, titem);
        return;
    } else if (item.itemtype == "flag") {
        if (!this.flagsrenderer[item.name]) this.flagsrenderer[item.name] = new ItemRendererFlag();
        this.flagsrenderer[item.name].drawFlag(ctx, item, x, y, width, height, scale, titem);
        return;
    }

    var renderer = titem.renderer;
    if (renderer) {
        if (renderer == "scaffold") this.scaffoldrenderer.drawSupport(ctx, item, x, y, width, height, titem, drawdetails);
        else if (renderer == "wood") this.woodrenderer.drawSupport(ctx, item, x, y, width, height, titem, drawdetails);
        return;
    }
    
    
    titem.ramp = "";
    if (item.ramp) titem.ramp = item.ramp;
    
    var color = titem.color;
    
    if (color) {
        if (color.gradient) {
            var gradient = color.gradient;
            var g = ctx.createLinearGradient(0, y, 0, height + y);
            var start = gradient.start;
            var stop = gradient.stop;
            if (lighten) {
                start = lightenColor(start, this.lighten);
                stop = lightenColor(stop, this.lighten);
            }
            g.addColorStop(0, start);
            g.addColorStop(1, stop);
            color = g;
        } else if (lighten) color = lightenColor(color, lighten);
    } else {
        color = color ? color : "magenta";
    }
    
    if (titem.parts) {
        var arr = [];
        for (var prop in titem) arr.push(prop);
        var bitem = {};
        for (var n = arr.length; n--;) bitem[arr[n]] = titem[arr[n]];
        if (item.draw != false) {
            if (outline === true) {
                outlinewidth = outlinewidth ? outlinewidth : this.outlinewidth
                this.drawItemParts(ctx, bitem.parts, x, y, width, height, color, lighten, true, outlinewidth, this.outlineopacity, scale);
            }
            this.drawItemParts(ctx, bitem.parts, x, y, width, height, color, lighten, false, 0, 0, scale);
        }
        if (item.parts) {
            
            
            
            // here -> need to see if item parts have a theme
            
            
            
            
            this.drawItem(ctx, color, item.parts, x, y, width, height, lighten, outline, outlinewidth, scale);
        }
    } else {
        if (item.draw != false) {
            ctx.fillStyle = color;
            if (outline === true) {
                outlinewidth = outlinewidth ? outlinewidth : this.outlinewidth
                drawShapeOutline(ctx, this.outlinecolor, item, x, y, width, height, outlinewidth, this.outlineopacity, scale);
            }
            drawShape(ctx, titem, x, y, width, height, scale);
        }
        
        if (item.parts) {
            for (var p in item.parts) {
                var pp = item.parts[p];
                if (pp.width && pp.height) {
                    
                    width = pp.width * scale;
                    height = pp.height * scale;
                    var px = x + pp.x * scale;
                    var py = y + pp.y * scale;
                    
                    
                    if (item.currentaction) {
                        var speed;
                        if (item.velx != 0) speed = item.velx;
                        if (item.vely != 0) speed = -item.vely * 2;
                        
                        if (pp.actions) {
                            for (var i = 0; i < pp.actions.length; i++) {
                                if (pp.actions[i].rotate != "") pp.actions[i].rotate = speed;
                            }
                        }
                    }

                    this.drawItem(ctx, color, pp, px, py, width, height, lighten, outline, outlinewidth, scale);
                }
            }
        }
    }
}

ItemRenderer.prototype.drawItemParts = function(ctx, parts, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity, scale) { 
    for (var part in parts) this.drawItemPart(ctx, parts[part], x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity, scale);
}

ItemRenderer.prototype.drawItemPart = function(ctx, part, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity, scale) {
    if (part.height && part.width) this.drawPart(ctx, part, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity, scale);
    
    if (outline === true) return;
    if (part.parts) {
        color = (part.color) ? part.color : color;
        this.drawItemParts(ctx, part.parts, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity, scale);
    }
}

ItemRenderer.prototype.drawPart = function(ctx, part, x, y, width, height, color, lighten, outline, outlinewidth, outlineopacity, scale) {

    var pw = width;
    var ph = height;
    
    var pad = .8;
    var part_x = x + (pw * ((part.x - (pad / 2)) / 100));
    var part_y = y + (ph * ((part.y - (pad / 2)) / 100));
    var part_width = pw * ((part.width + pad) / 100);
    var part_height = ph * ((part.height + pad) / 100);
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

    
    
    
    
    if (part.angle) {
        ctx.save();
        ctx.translate(part_x + part_width / 2, part_y + part_height / 2);
        var rad = part.angle * Math.PI / 180;
        ctx.rotate(rad);
        part_x = -part_width / 2;
        part_y = -part_height / 2;
    }
    
    
    
    
    if (outline) c = color;
    else c = part.color ? part.color : color;
    if (lighten) c = lightenColor(c, lighten);
    ctx.fillStyle = c;
    drawShape(ctx, part, part_x, part_y, part_width, part_height, scale);
    
    if (outline === true) drawShapeOutline(ctx, this.outlinecolor, part, part_x, part_y, part_width, part_height, outlinewidth, outlineopacity, scale);
    
    if (part.angle) {
        ctx.restore();
    }
}