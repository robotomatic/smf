"use strict";

/*

    TODO:

    - Fix this ugly fucker!!!
    
    
    - Need better name than Renderer for dynamic stuff...

    - Tops have materials as well
    
    - projection needs to respect craziness and roundness
    
    - Tops need to respect craziness and roundness
    
    
    - Fix remaining materials
    
    - Structures..........

    - need graphics class to wrap all canvas calls!!!!!!
    
    - common items
    
    - 3d drawing tops a little fucky
    
    - strange color change thing WTF
    
    - rocks need to place grass
    
    - rocks angle
    
    - rocks sometimes double
    
    - add z coordinate option

    - platform shadows on supports....support shdders
    
    - round ends of supports?
    
    - draw through supports (deep depth)

    
    - platforms radius
    
    - platforms craziness

*/



/*

ItemRenderManagerRendererParts - each part should pass though render tree so parts can have materials

ItemRenderManagerRendererDefault

ItemRenderManagerRendererMaterial

ItemRenderManagerRendererTheme

ItemRenderManagerRendererDynamic / ItemRenderManagerRendererAnimated

ItemRenderManagerRendererTops


*/



function ItemRenderManagerRenderer() {
    this.box = new Rectangle();
    this.polygon = new Polygon();
    this.rectangle = new Rectangle(0, 0, 0, 0);
    this.triangle = new Triangle(0, 0, 0, 0, 0);
    this.itemrenderer = new ItemRenderer();
    this.itemmaterals = new ItemMaterial();
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
    
ItemRenderManagerRenderer.prototype.drawItemRenderer = function(ctx, color, item, window, x, y, width, height, titem, scale) { 
    if (!titem.renderer) return false;
    return this.itemrenderer.render(ctx, color, titem.renderer, item, window, x, y, width, height, titem, scale);
}

ItemRenderManagerRenderer.prototype.drawItemTheme = function(ctx, color, item, window, x, y, width, height, titem, scale) { 

    if (!titem) return false;
    if (titem.draw === false) return true;
    
    titem.angle = (item.angle) ? item.angle : 0;
    titem.ramp = (item.ramp) ? item.ramp : "";
    if (!scale) scale = 1;
    
    this.box.x = x;
    this.box.y = y;
    this.box.width = width;
    this.box.height = height;
    
    var angle = item.angle;
    
    color = titem.color;
    if (color) {
        if (color.gradient && (height > 0 || color.gradient.top)) {
            var gradient = color.gradient;
            
            var t = gradient.top ? ((gradient.top - item.y) * scale) + y  : y;
            var h = gradient.height ? gradient.height * scale  : height;

            if (isNaN(t) || isNaN(h)) return;
            
            var g = ctx.createLinearGradient(0, t, 0, h + t);
            
            var start = gradient.start;
            var stop = gradient.stop;
            g.addColorStop(0, start);
            g.addColorStop(1, stop);
            color = g;
        } else  {
            if (color) color = color.color ? color.color : color;  
            else color = "magenta";
        }
    }
    ctx.fillStyle = color;

    if (titem.itemtype == "group") {
        this.polygon.points.length = 0;
        this.polygon.setPoints(item.polygon.getPoints());
        this.polygon.translate(x, y, scale);
    } else {
        this.polygon.points.length = 0;
        this.polygon.setPoints(this.box.getPoints());
    }
    
    var material = titem.material;
    if (material) {
        var m = this.drawItemMaterial(ctx, item, titem, material, x, y, width, height, color, scale, angle);
        if (m) return;
    }
    
    if (titem.itemtype == "group") {
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
    
    if (angle) {
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
    
ItemRenderManagerRenderer.prototype.drawItemMaterial = function(ctx, item, titem, material, x, y, width, height, color, scale, angle) { 
    // todo: this needs to expose canvas so it can be used to clip
    // todo: item mbr is fucky
    var m = this.itemmaterals.render(ctx, color, material, item, this.polygon, window, x, y, width, height, titem, scale);
    var top = titem.top;
    if (top) this.drawPlatformTops(ctx, item, x, y, scale, top);
    return m;
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










ItemRenderManagerRenderer.prototype.drawPlatformTops = function(ctx, item, x, y, scale, top) {
    var color = top.color.light;
    var ptops = item.polytops;
    var offset = 5;
    var shadowoffset = offset * 1.5;
    var shadow = top.color.dark;
    ctx.globalAlpha = .8;
    ctx.beginPath();
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, shadow, shadowoffset, false);
    ctx.fill();
    ctx.globalAlpha = 1;
    for (var i = 0; i < ptops.length; i++) this.drawPlatformTop(ctx, ptops[i], pad, x, y, scale, color, offset, true);
}

ItemRenderManagerRenderer.prototype.drawPlatformTop = function(ctx, top, pad, x, y, scale, color, offset, details) {

    var mbr = top.getMbr();
    if (mbr.width < 15 || mbr.height < 5) return;
    
    var t = top.points.length;
    var pl = new Polygon();
    for (var i = 0; i < t; i++) {
        var p = new Point(x + (top.points[i].x * scale), y + (top.points[i].y * scale) + (offset * scale));
        pl.addPoint(p);
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    pl.draw(ctx, 20);
}            


