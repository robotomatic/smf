"use strict";

/*

    TODO:

    - Fix this ugly fucker!!!
    
    

    - Tops have materials as well
    
    - projection needs to respect craziness and roundness
    
    - Tops need to respect craziness and roundness
    
    
    - Structures..........

    - need graphics class to wrap all canvas calls!!!!!!
    
    - common items
    
    
    
    - strange color change thing WTF
    
    
    - rocks angle
    
    - rocks sometimes double
    
    - add z coordinate option

    - platform shadows on supports....support shdders
    
    - round ends of supports?
    
    - draw through supports (deep depth)

    
    - platforms radius
    
    - platforms craziness
    
    - find a way to clean out memory!!!!!
    
    

    
    
    - after render pass AFTER player render!!!!
    
    - fix shadder mask on platforms
    
    - find a way to render shadders based on zindex
    




    
    - need to consolidate color setter - support animation
    
    - need to consolidate angle
    
    - need to conslidate geomerty creation & iteration
    
    
    

*/



"use strict";

function ItemRenderer(theme) {
    this.theme = theme;
    this.itemrendererdefault = new ItemRendererDefault();
    this.itemrenderertheme = new ItemRendererTheme();
    this.itemrenderertops = new ItemRendererTops();
    this.box = new Rectangle(0, 0, 0, 0);
    
    
    this.p1 = new Point(0, 0);
    this.p2 = new Point(0, 0);
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);
    
    this.polygon = new Polygon();
    
}

ItemRenderer.prototype.shouldThemeProject = function(item, p) {
    var titem = this.theme.items[String(item.itemtype)];
    if (!titem) return p;
    if (titem.depth === 0) return false;
    if (titem.depth > 0) return titem.depth;
    return p;
}
    
ItemRenderer.prototype.drawItem = function(ctx, color, item, window, ox, oy, box, scale, tops, drawitems) {
    if (item.draw == false) return;
    var x = box.x;
    var y = box.y;
    var width = box.width;
    var height = box.height;
    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
        console.log("ItemRenderer: null value!!");
        return;
    }
    var titem = this.getItemTheme(item);
    if (!titem) {
        color = color ? color : item.color ? item.color : "green";
        this.itemrendererdefault.render(ctx, color, item, window, x, y, width, height, scale);
        return;
    }
    if (titem.draw === false) return;
    this.itemrenderertheme.render(ctx, color, item, window, x, y, width, height, titem, scale);
    this.drawItemTops(ctx, color, item, window, x, y, width, height, box, titem, scale);
    if (drawitems !== false && titem.after) this.drawItemItems(ctx, color, item, window, x, y, box, scale, titem, titem.after, "after");
}

ItemRenderer.prototype.drawItemCacheItems = function(ctx, color, item, window, ox, oy, box, scale, tops) {
    if (item.draw == false) return;
    var x = box.x;
    var y = box.y;
    var width = box.width;
    var height = box.height;
    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
        console.log("ItemRenderer: null value!!");
        return;
    }
    var titem = this.getItemTheme(item);
    if (!titem) return;
    if (titem.draw === false) return;
    if (titem.after) this.drawItemItems(ctx, color, item, window, x, y, box, scale, titem, titem.after, "after");
}

ItemRenderer.prototype.getItemTheme = function(item) {
    if (!this.theme) {
        console.log("ItemRenderer: null theme!!");
        return null; 
    }
    return this.theme.items[item.itemtype];
}
    
ItemRenderer.prototype.drawItemTops = function(ctx, color, item, window, x, y, width, height, box, titem, scale) {
    if (!titem.top) return;
    this.itemrenderertops.render(ctx, color, item, window, x, y, width, height, titem, scale);
}
    
ItemRenderer.prototype.drawItemBefore = function(ctx, color, item, window, x, y, box, scale) {
    var titem = this.getItemTheme(item);
    if (!titem) return;
    if (titem.before) this.drawItemItems(ctx, color, item, window, x, y, box, scale, titem, titem.before, "before");
    if (titem.top) this.drawItemBeforeTop(ctx, color, item, titem, window, x, y, box, scale);
}

ItemRenderer.prototype.drawItemBeforeTop = function(ctx, color, item, titem, window, x, y, box, scale) {
    if (!titem.top.before) return;
    var ptops = item.polytops;
    var depth = item.depth * scale;
    var wc = window.getCenter();
    var t = ptops.length;
    for (var i = 0; i < t; i++) {
        var ptop = ptops[i];
        var pt = ptop.points.length - 1;
        var b = titem.top.before[0];
        this.box.width = b.width * scale;
        this.box.height = b.height * scale;
        this.box.x = box.x + ((b.x + ptop.points[pt].x) * scale);
        this.box.y = (box.y + (ptop.points[pt].y * scale)) - this.box.height;

        this.p1.x = this.box.x;
        this.p1.y = this.box.y;
        this.p2.x = this.p1.x + this.box.width;
        this.p2.y = this.p1.y;
        this.polygon = project3D(this.p1, this.p2, depth, this.polygon, window.width, window.height, scale, x, y, wc, this.np1, this.np2);        
        this.box.x = this.polygon.points[0].x;
        this.box.y = this.polygon.points[0].y;
        this.drawItemItemTop(ctx, color, item, titem, titem.top.before[0], window, x, y, this.box, scale, "before");

        b = titem.top.before[1];
        var pt = clamp(ptop.points.length / 2);
        this.box.width = b.width * scale;
        this.box.height = b.height * scale;
        this.box.x = (box.x + ((ptop.points[pt].x - b.x) * scale)) - this.box.width;
        this.box.y = (box.y + (ptop.points[pt].y * scale)) - this.box.height;

        this.p1.x = this.box.x;
        this.p1.y = this.box.y;
        this.p2.x = this.p1.x + this.box.width;
        this.p2.y = this.p1.y;
        this.polygon = project3D(this.p1, this.p2, depth, this.polygon, window.width, window.height, scale, x, y, wc, this.np1, this.np2);        
        this.box.x = this.polygon.points[1].x - this.box.width;
        this.box.y = this.polygon.points[1].y;
        this.drawItemItemTop(ctx, color, item, titem, titem.top.before[0], window, x, y, this.box, scale, "before");
    }
}

ItemRenderer.prototype.drawItemAfter = function(ctx, color, item, window, x, y, box, scale) {
    var titem = this.getItemTheme(item);
    if (!titem) return;
    if (titem.top) this.drawItemAfterTop(ctx, color, item, titem, window, x, y, box, scale);
}

ItemRenderer.prototype.drawItemAfterTop = function(ctx, color, item, titem, window, x, y, box, scale) {
    if (!titem.top.after) return;
    var ptops = item.polytops;
    var t = ptops.length;
    for (var i = 0; i < t; i++) {
        var ptop = ptops[i];
        var pt = ptop.points.length - 1;
        var a = titem.top.after[0];
        this.box.width = a.width * scale;
        this.box.height = a.height * scale;
        this.box.x = box.x + ((a.x + ptop.points[pt].x) * scale);
        this.box.y = (box.y + (ptop.points[pt].y * scale)) - this.box.height;
        this.drawItemItemTop(ctx, color, item, titem, titem.top.after[0], window, x, y, this.box, scale, "after");

        a = titem.top.after[1];
        var pt = clamp(ptop.points.length / 2);
        this.box.width = a.width * scale;
        this.box.height = a.height * scale;
        this.box.x = (box.x + ((ptop.points[pt].x - a.x) * scale)) - this.box.width;
        this.box.y = (box.y + (ptop.points[pt].y * scale)) - this.box.height;
        this.drawItemItemTop(ctx, color, item, titem, titem.top.after[1], window, x, y, this.box, scale, "after");
    }
}

ItemRenderer.prototype.drawItemItems = function(ctx, color, item, window, x, y, box, scale, titem, items, name) {
    var keys = Object.keys(items);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var iitem = items[keys[i]];
        this.drawItemItem(ctx, color, item, titem, iitem, window, x, y, box, scale, name);
    }
}

ItemRenderer.prototype.drawItemItemTop = function(ctx, color, item, titem, itemitem, window, x, y, box, scale, name) {
    var width = window.width;
    var height = window.height;
    this.box.x = box.x;
    this.box.y = box.y;
    this.box.width = box.width;
    this.box.height = box.height;
    
    var titem = this.getItemTheme(item);
    if (!titem) {
        color = color ? color : item.color ? item.color : "green";
        this.itemrendererdefault.render(ctx, color, this.box, window, x, y, width, height, scale);
        return;
    }
    if (titem.draw === false) return;
    this.itemrenderertheme.render(ctx, color, this.box, window, x, y, width, height, itemitem, scale, name);    
}
    
ItemRenderer.prototype.drawItemItem = function(ctx, color, item, titem, itemitem, window, ox, oy, box, scale, name) {
    
    var x = box.x;
    var y = box.y;
    var width = box.width;
    var height = box.height;
    
    var ix = itemitem.x;
    var iy = itemitem.y;
    var iw = itemitem.width;
    var ih = itemitem.height;

    this.box.x = round(x + (width * (ix / 100)));
    this.box.y = round(y + (height * (iy / 100)));
    this.box.width = round(width * (iw / 100));
    this.box.height = round(height * (ih / 100));

    var titem = this.getItemTheme(item);
    if (!titem) {
        color = color ? color : item.color ? item.color : "green";
        this.itemrendererdefault.render(ctx, color, this.box, window, x, y, width, height, scale);
        return;
    }
    if (titem.draw === false) return;
    this.itemrenderertheme.render(ctx, color, this.box, window, x, y, width, height, itemitem, scale, name);    
}