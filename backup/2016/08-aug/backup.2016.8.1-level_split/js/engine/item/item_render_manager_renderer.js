"use strict";

function ItemRenderManagerRenderer() {
    this.polygon = new Polygon();
    this.rectangle = new Rectangle(0, 0, 0, 0);
    this.triangle = new Triangle(0, 0, 0, 0, 0);
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
    this.drawShape(ctx, x, y, width, height, item);
    if (item.angle) ctx.restore();
}
    
ItemRenderManagerRenderer.prototype.drawItemTheme = function(ctx, color, item, x, y, width, height, scale, titem, ox, oy) { 
    color = titem.color;
    if (color) {
        if (color.gradient && (height > 0 || color.gradient.top)) {
            var gradient = color.gradient;
            
            var t = gradient.top ? (gradient.top - oy) * scale : y;
            var h = gradient.height ? gradient.height * scale : height;

            if (isNaN(t) || isNaN(h)) return;
            
            var g = ctx.createLinearGradient(0, t, 0, h + t);
            
            var start = gradient.start;
            var stop = gradient.stop;
            g.addColorStop(0, start);
            g.addColorStop(1, stop);
            color = g;
        }
    } else  color = color ? color : "magenta";
    ctx.fillStyle = color;

    if (titem.itemtype == "group") {
        this.polygon.points.length - 0;
        this.polygon.createPolygon(item.parts);
        this.polygon.craziness(0);
        this.polygon.translate(x, y, scale);
        this.polygon.draw(ctx);
        return;
    }
        
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
    
    this.drawShape(ctx, x, y, width, height, titem);
    
    if (item.angle) ctx.restore();
}
    
ItemRenderManagerRenderer.prototype.drawItemParts = function(ctx, parts, x, y, width, height, color, scale, angle) { 
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
         this.drawItemPart(ctx, parts[keys[i]], x, y, width, height, color, scale, angle);
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
    var part_x = round(x + (pw * ((part.x - (pad / 2)) / 100)));
    var part_y = round(y + (ph * ((part.y - (pad / 2)) / 100)));
    var part_width = round(pw * ((part.width + pad) / 100));
    var part_height = round(ph * ((part.height + pad) / 100));

    if (angle || part.angle) {
        ctx.save();
        ctx.translate(part_x + part_width / 2, part_y + part_height / 2);
        var rad = round(part.angle * Math.PI / 180);
        ctx.rotate(rad);
        part_x = round(-part_width / 2);
        part_y = round(-part_height / 2);
    }
    
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
    c = part.color ? part.color : color;
    if (c) {
        if (c.gradient) {
            var gradient = c.gradient;
            
            var t = gradient.top ? 0 : part_y;
            var h = gradient.height ? height : part_height;

            var g = ctx.createLinearGradient(0, t, 0, h + t);
            
            var start = gradient.start;
            var stop = gradient.stop;
            g.addColorStop(0, start);
            g.addColorStop(1, stop);
            c = g;
        }
    }
    ctx.fillStyle = c;
    
    this.drawShape(ctx, part_x, part_y, part_width, part_height, part);
    
    if (part.angle) ctx.restore();
}

ItemRenderManagerRenderer.prototype.drawShape = function(ctx, x, y, width, height, item) { 
    ctx.beginPath();
    var s;
    if (item.ramp) {
        this.triangle.x = x;
        this.triangle.y = y;
        this.triangle.width = width;
        this.triangle.height = height;
        this.triangle.ramp = item.ramp;
        this.triangle.draw(ctx)
    } else {
        this.rectangle.x = x;
        this.rectangle.y = y;
        this.rectangle.width = width;
        this.rectangle.height = height;
        this.rectangle.draw(ctx)
    }
}