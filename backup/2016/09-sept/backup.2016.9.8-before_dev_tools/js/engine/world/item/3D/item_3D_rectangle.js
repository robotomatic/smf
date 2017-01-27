"use strict";

function Item3DRectangle() {

    this.p1 = new Point(0, 0);
    this.p2 = new Point(0, 0);
    this.p3 = new Point(0, 0);
    this.p4 = new Point(0, 0);
    
    this.cp = new Point(0, 0);
    this.np = new Point(0, 0);
    this.np1 = new Point(0, 0);
    this.np2 = new Point(0, 0);
    
    this.polygon = new Polygon();

    this.sidecolor = "red";
    this.topcolor = "white";
    this.bottomcolor = "blue";
    
    this.topsidecolor = "red";
    this.toptopcolor = "white";
    this.topbottomcolor = "blue";
}

Item3DRectangle.prototype.renderItem3D = function(now, ctx, item, renderer, window, x, y, depth, scale) {

    var wc = window.getCenter();

    var box = item.box;
    var ix = box.x;
    var iy = box.y;
    var iw = box.width;
    var ih = box.height;
    
    this.p1.x = round(ix);
    this.p1.y = round(iy);
    
    this.p2.x = round(ix + iw);
    this.p2.y = this.p1.y;
    
    this.p3.x = this.p2.x;
    this.p3.y = round(iy + ih);
    
    this.p4.x = this.p1.x;
    this.p4.y = this.p3.y;

    this.sidecolor = "red";
    this.topcolor = "white";
    this.bottomcolor = "blue";
    var theme = (renderer && renderer.theme) ? renderer.theme.items[item.itemtype] : null;
    if (theme) {
        var tc = "";
        if (theme.material && theme.material.color && theme.material.color.projected) tc = theme.material.color.projected;
        else if (theme.color && theme.color.projected) tc = theme.color.projected;
        if (tc) {
            if (tc.top) this.topcolor = tc.top;
            if (tc.side) this.sidecolor = tc.side;
            if (tc.bottom) this.bottomcolor = tc.bottom;
        }
    }

    ctx.fillStyle = this.sidecolor;
    if (shouldProject(this.p2, this.p3, scale, x, y, wc, this.cp)) {
        this.polygon = project3D(this.p2, this.p3, depth, this.polygon, scale, x, y, wc, this.np1, this.np2);        
        ctx.beginPath();
        this.polygon.draw(ctx);
    }

    if (shouldProject(this.p4, this.p1, scale, x, y, wc, this.cp)) {
        this.polygon = project3D(this.p4, this.p1, depth, this.polygon, scale, x, y, wc, this.np1, this.np2);
        ctx.beginPath();
        this.polygon.draw(ctx);
    }
    
    if (shouldProject(this.p1, this.p2, scale, x, y, wc, this.cp)) {
        this.polygon = project3D(this.p1, this.p2, depth, this.polygon, scale, x, y, wc, this.np1, this.np2);
        ctx.fillStyle = this.topcolor;
        ctx.beginPath();
        this.polygon.draw(ctx);
    }
    
    if (shouldProject(this.p3, this.p4, scale, x, y, wc, this.cp)) {
        this.polygon = project3D(this.p3, this.p4, depth, this.polygon, scale, x, y, wc, this.np1, this.np2);
        ctx.fillStyle = this.bottomcolor;
        ctx.beginPath();
        this.polygon.draw(ctx);
    }
}