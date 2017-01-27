function ItemRendererDefault() {
    this.rectangle = new Rectangle(0, 0, 0, 0);
    this.triangle = new Triangle(0, 0, 0, 0, 0);
}

ItemRendererDefault.prototype.render = function(ctx, color, item, window, x, y, width, height, scale) { 
    ctx.fillStyle = color;
    if (item.angle) {
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        var rad = item.angle * Math.PI / 180;
        ctx.rotate(rad);
        x = -width / 2;
        y = -height / 2;
    }
    if (item.parts) this.drawItemParts(ctx, item.parts, x, y, width, height, color, scale, 0);
    else this.drawItemPart(ctx, item, x, y, width, height, color, scale, angle);
    if (item.angle) ctx.restore();
}

ItemRendererDefault.prototype.drawItemParts = function(ctx, parts, x, y, width, height, color, scale, angle) { 
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
         this.drawItemPart(ctx, parts[keys[i]], x, y, width, height, color, scale, angle);
    }
}

ItemRendererDefault.prototype.drawItemPart = function(ctx, part, x, y, width, height, color, scale, angle) {
    if (part.height && part.width) this.drawPart(ctx, part, x, y, width, height, color, scale, angle);
    if (part.parts) {
        color = (part.color) ? part.color : color;
        this.drawItemParts(ctx, part.parts, x, y, width, height, color, scale, angle);
    }
}

ItemRendererDefault.prototype.drawPart = function(ctx, part, x, y, width, height, color, scale, angle) {

    var part_x = round(x + (part.x * scale));
    var part_y = round(y + (part.y * scale));
    var part_width = round(part.width * scale);
    var part_height = round(part.height * scale);
    
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

ItemRendererDefault.prototype.drawShape = function(ctx, x, y, width, height, item) { 
    ctx.beginPath();
    var s;
    if (item.ramp) {
        this.triangle.x = x;
        this.triangle.y = y;
        this.triangle.width = width;
        this.triangle.height = height;
        this.triangle.info = item.ramp;
        this.triangle.draw(ctx)
    } else {
        this.rectangle.x = x;
        this.rectangle.y = y;
        this.rectangle.width = width;
        this.rectangle.height = height;
        this.rectangle.draw(ctx)
    }
}