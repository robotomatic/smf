"use strict";

function Image(data, x, y, width, height) {
    this.data = data;
    this.x = x || 0;
    this.y = y || 0;
    this.width = width;
    this.height = height;
    this.clip = {
        x : 0,
        y : 0
    };
    this.rectangle = new Rectangle(0, 0, 0, 0);
}

Image.prototype.clipY = function(y) {
    this.clip.y = y;
}

Image.prototype.draw = function(ctx, dx, dy, dw, dh) {
    
    if (this.width == 0  || this.height == 0) return;
    if ((dw && dw < 0) || (dh && dh < 0)) return;

    this.x = round(this.x);
    this.y = round(this.y);
    this.width = round(this.width);
    this.height = round(this.height);

    if (dx || dy || dw || dh) {
        dx = round(dx);
        dy = round(dy);
        dw = round(dw);
        dh = round(dh);
    }
        
    if ((dx || dy || dw || dh) && (dx != this.x || dy != this.dy || dw != this.width || dh != this.height)) {

        this.rectangle.x = dx;
        this.rectangle.y = dy;
        this.rectangle.height = dh;
        this.rectangle.width = dw;
        
        var clip = false;
        if (this.clip.x && (dx + dw > this.clip.x)) {
            var dd = dx + dw - this.clip.x;
            this.rectangle.width = round(this.rectangle.width - dd);
            clip = true;
        }

        if (this.clip.y && dy + dh > this.clip.y) {
            var dd = dy + dh - this.clip.y;
            this.rectangle.height = round(this.rectangle.height - dd);
            clip = true;
        }
        
        if (clip) {
            ctx.save();
            ctx.beginPath();
            this.rectangle.path(ctx);
            ctx.clip();
        }
        
        ctx.drawImage(this.data, this.x, this.y, this.width, this.height, dx, dy, dw, dh);
        
        if (clip) ctx.restore();
        
    } else {
        ctx.drawImage(this.data, this.x, this.y, this.width, this.height);
    }
}

Image.prototype.patch = function(ctx, px, py, pw, ph) {
    ctx.drawImage(this.data, this.x, this.y, pw, ph, px, py, pw, ph);
}
