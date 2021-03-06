"use strict";

function ItemRenderManagerRenderer() {
    
}

ItemRenderManagerRenderer.prototype.drawItemDefault = function(ctx, color, item, x, y, width, height) { 
    ctx.fillStyle = color;
    if (item.angle) {
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        var rad = item.angle * Math.PI / 180;
        ctx.rotate(rad);
        x = -width / 2;
        y = -height / 2;
    }
    var r = new Rectangle(x, y, width, height);
    r.draw(ctx);
    if (item.angle) ctx.restore();
}
    
ItemRenderManagerRenderer.prototype.drawItemTheme = function(ctx, color, item, x, y, width, height, scale, titem) { 

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
    ctx.fillStyle = color;
    
    if (titem.parts) {
        var keys = Object.keys(titem);
        var bitem = [];
        for (var n = keys.length; n--;) bitem[keys[n]] = titem[keys[n]];
        this.drawItemParts(ctx, bitem.parts, x, y, width, height, color, scale, item.angle);
        return;
    }

    if (item.angle) {
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        var rad = item.angle * Math.PI / 180;
        ctx.rotate(rad);
        x = -width / 2;
        y = -height / 2;
    }
    
    drawShape(ctx, titem, x, y, width, height, scale);
    
    if (item.angle) {
        ctx.restore();
    }
}


    
ItemRenderManagerRenderer.prototype.drawItemParts = function(ctx, parts, x, y, width, height, color, scale, angle) { 
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
         var part = keys[i];
         this.drawItemPart(ctx, parts[part], x, y, width, height, color, scale, angle);
    }
}

ItemRenderManagerRenderer.prototype.drawItemPart = function(ctx, part, x, y, width, height, color, scale, angle) {
    if (part.height && part.width) this.drawPart(ctx, part, x, y, width, height, color, scale, angle);
    if (part.parts) {
        color = (part.color) ? part.color : color;
        this.drawItemParts(ctx, part.parts, x, y, width, height, color, scale, angle);
    }
}

ItemRenderManagerRenderer.prototype.drawPart = function(ctx, part, x, y, width, height, color, scale, angle) {

    var pw = width;
    var ph = height;
    
    var pad = .8;

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