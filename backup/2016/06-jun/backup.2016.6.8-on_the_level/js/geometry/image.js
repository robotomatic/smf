"use strict";

function Image(data, x, y, width, height) {
    this.data = data;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}


Image.prototype.draw = function(ctx, dx, dy, dw, dh) {
    
    if (this.width == 0  || this.height == 0) return;
    if ((dw && dw < 0) || (dh && dh < 0)) return;

    // todo: wtf?
    this.x = round(this.x);
    this.y = round(this.y);
    this.width = round(this.width);
    this.height = round(this.height);

    if (dx) {
        dx = round(dx);
        dy = round(dy);
        dw = round(dw);
        dh = round(dh);
        ctx.drawImage(this.data, this.x, this.y, this.width, this.height, dx, dy, dw, dh);
    }
    else ctx.drawImage(this.data, this.x, this.y, this.width, this.height);
    
//    try {
//        if (dx) ctx.drawImage(this.data, this.x, this.y, this.width, this.height, dx, dy, dw, dh);
//        else ctx.drawImage(this.data, this.x, this.y, this.width, this.height);
//        console.log(this.x + " / " + this.y + " / " + this.width + " / " + this.height + " / " + dx + " / " + dy + " / " + dw + " / " + dh);
//    } catch (x) {
//        console.log("----->" + this.x + " / " + this.y + " / " + this.width + " / " + this.height + " / " + dx + " / " + dy + " / " + dw + " / " + dh);
//    }
    
}