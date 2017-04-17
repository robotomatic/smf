"use strict";

function GameCanvas(id) {
    this.canvas = document.createElement('canvas');
    this.canvas.id = id;
    this.ctx = this.canvas.getContext("2d");
    this.classname = "";
    this.top = 0;
    this.left = 0;
    this.width = 0;
    this.height = 0;
    
    this.current = {
        dirty : false,
        save : false,
        clip : false,
        color : "",
        linecolor : "",
        linewidth : 0,
        linecap : "",
        font : "",
        alpha : 0,
        op : "",
        fill : false,
        fillrect : false,
        stroke : false,
        strokerect : false,
        rect : {
            x : 0,
            y : 0,
            width : 0,
            height : 0
        },
        filltext : false,
        text : {
            text : "",
            x : 0,
            y : 0
        }
    };
    
    this.gradient = {
        linear : {
            x : 0,
            y : 0,
            w : 0,
            h : 0,
            gradient : null
        },
        radial : {
            x0 : 0,
            y0 : 0,
            r0 : 0,
            x1 : 0,
            y1 : 0,
            r1 : 0,
            gradient : null
        }
    }
}

GameCanvas.prototype.setClassName = function(classname) {
    this.classname = classname;
    this.canvas.className = classname;
}

GameCanvas.prototype.setPosition = function(left, top) {
    this.left = left;
    this.top = top;
    this.canvas.style.left = left + "px";
    this.canvas.style.top = top + "px";
}

GameCanvas.prototype.setSize = function(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
}

GameCanvas.prototype.getWidth = function() {
    return this.width;
}

GameCanvas.prototype.getHeight = function(s) {
    return this.height;
}

GameCanvas.prototype.setScale = function(s) {
    this.canvas.style.webkitTransform = "scale(" + (s) + ")";
}

GameCanvas.prototype.setBackground = function(color) {
    this.canvas.style.background = color;
}

GameCanvas.prototype.attach = function(what) {
    what.appendChild(this.canvas);
}

GameCanvas.prototype.clear = function() {
    clearRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height);
}


GameCanvas.prototype.reset = function() {
    this.current.dirty = false;
    this.current.save = false;
    this.current.clip = false;
    this.current.color = "";
    this.current.linecolor = "";
    this.current.linewidth = 0;
    this.current.linecap = "";
    this.current.font = "";
    this.current.alpha = 0;
    this.current.op = "";
    this.current.fill = false;
    this.current.fillrect = false;
    this.current.stroke = false;
    this.current.strokerect = false;
    this.current.rect.x = 0;
    this.current.rect.y = 0;
    this.current.rect.width = 0;
    this.current.rect.height = 0;
    this.current.filltext = false;
    this.current.text.text = "";
    this.current.text.x = 0;
    this.current.text.y = 0;
}
    
GameCanvas.prototype.commit = function() {
    if (this.current.fill) this.ctx.fill();
    if (this.current.fillrect) {
        this.ctx.fillRect(round(this.current.rect.x), round(this.current.rect.y), round(this.current.rect.width), round(this.current.rect.height));
    }
    if (this.current.stroke) this.ctx.stroke();
    if (this.current.strokerect) {
        this.ctx.strokeRect(round(this.current.rect.x), round(this.current.rect.y), round(this.current.rect.width), round(this.current.rect.height));
    }
//    if (this.current.filltext) this.ctx.fillText(this.current.text.text, round(this.current.text.x), round(this.current.text.y));
    this.reset();
}





GameCanvas.prototype.setAlpha = function(alpha) {
    if (this.current.alpha == alpha) return;
    this.commit();
    this.current.alpha = alpha;
    this.ctx.globalAlpha = alpha;
}

GameCanvas.prototype.setCompositeOperation = function(op) {
    if (this.current.op == op) return;
    this.commit();
    this.current.op = op;
    this.ctx.globalCompositeOperation = op;
}



GameCanvas.prototype.setFillStyle = function(color) {
    if (this.current.color == color) return;
    this.commit();
    this.current.color = color;
    this.ctx.fillStyle = color;
}

GameCanvas.prototype.setStrokeStyle = function(color) {
    if (this.current.linecolor == color) return;
    this.commit();
    this.current.linecolor = color;
    this.ctx.strokeStyle = color;
}

GameCanvas.prototype.setLineWidth = function(width) {
    if (this.current.linewidth == width) return;
    this.commit();
    this.current.linewidth = width;
    this.ctx.lineWidth = width;
}

GameCanvas.prototype.setLineCap = function(cap) {
    if (this.current.linecap == cap) return;
    this.commit();
    this.current.linecap = cap;
    this.ctx.lineCap = cap;
}

GameCanvas.prototype.setFont = function(font) {
    if (this.current.font == font) return;
    this.commit();
    this.current.font = font;
    this.ctx.font = font;
}




GameCanvas.prototype.createLinearGradient = function(x, y, width, height) {
    var rx = clamp(x);
    var ry = clamp(y);
    var rw = clamp(width);
    var rh = clamp(height);
    if (this.gradient.linear.x == rx && this.gradient.linear.y == ry && this.gradient.linear.width == rw && this.gradient.linear.height == rh) {
        return this.gradient.linear.gradient;
    }
    this.gradient.linear.x = rx;
    this.gradient.linear.y = ry;
    this.gradient.linear.width = rw;
    this.gradient.linear.height = rh;
    this.gradient.linear.gradient = this.ctx.createLinearGradient(rx, ry, rw, rh);
    return this.gradient.linear.gradient;
}

GameCanvas.prototype.createRadialGradient = function(x0, y0, r0, x1, y1, r1) {
    
    var rx0 = clamp(x0);
    var ry0 = clamp(y0);
    var rr0 = clamp(r0);
    var rx1 = clamp(x1);
    var ry1 = clamp(y1);
    var rr1 = clamp(r1);
    
    if (this.gradient.radial.x0 == rx0 && this.gradient.radial.y0 == ry0 && this.gradient.radial.r0 == rr0 &&
        this.gradient.radial.x1 == rx1 && this.gradient.radial.y1 == ry1 && this.gradient.radial.r1 == rr1 ) {
        return this.gradient.radial.gradient;
    }
    this.gradient.radial.x0 = rx0;
    this.gradient.radial.y0 = ry0;
    this.gradient.radial.r0 = rr0;
    this.gradient.radial.x1 = rx1;
    this.gradient.radial.y1 = ry1;
    this.gradient.radial.r1 = rr1;
    this.gradient.radial.gradient = this.ctx.createRadialGradient(rx0, ry0, rr0, rx1, ry1, rr1);
    return this.gradient.radial.gradient;
}



GameCanvas.prototype.save = function() {
    this.current.save = true;
    this.commit();
    this.ctx.save();
}

GameCanvas.prototype.clip = function() {
    this.current.clip = true;
    this.ctx.clip();
}

GameCanvas.prototype.restore = function() {
    this.current.save = false;
    this.current.clip = false;
    this.commit();
    this.ctx.restore();
}





GameCanvas.prototype.beginPath = function() {
    this.ctx.beginPath();
}

GameCanvas.prototype.closePath = function() {
    this.ctx.closePath();
    this.current.dirty = true;
}









GameCanvas.prototype.moveTo = function(x, y) {
    var rx = round(x);
    var ry = round(y);
    this.ctx.moveTo(rx, ry);
    this.current.dirty = true;
}

GameCanvas.prototype.bezierCurveTo = function(x1, y1, x2, y2, x3, y3) {
    var rx1 = round(x1);
    var ry1 = round(y1);
    var rx2 = round(x2);
    var ry2 = round(y2);
    var rx3 = round(x3);
    var ry3 = round(y3);
    this.ctx.bezierCurveTo(rx1, ry1, rx2, ry2, rx3, ry3);
    this.current.dirty = true;
}

GameCanvas.prototype.quadraticCurveTo = function(x1, y1, x2, y2) {
    var rx1 = round(x1);
    var ry1 = round(y1);
    var rx2 = round(x2);
    var ry2 = round(y2);
    this.ctx.quadraticCurveTo(rx1, ry1, rx2, ry2);
    this.current.dirty = true;
}

GameCanvas.prototype.lineTo = function(x, y) {
    var rx = round(x);
    var ry = round(y);
    this.ctx.lineTo(rx, ry);
    this.current.dirty = true;
}

GameCanvas.prototype.arc = function(x, y, radius, start, end, ccw) {
    var rx = round(x);
    var ry = round(y);
    var rr = round(radius);
    var rs = round(start);
    var re = round(end);
    this.ctx.arc(rx, ry, rr, rs, re, ccw);
    this.current.dirty = true;
}


GameCanvas.prototype.rect = function(x, y, width, height) {
    var rx = round(x);
    var ry = round(y);
    var rw = round(width);
    var rh = round(height);
    this.ctx.rect(rx, ry, rw, rh);
    this.current.dirty = true;
}




GameCanvas.prototype.stroke = function() {
    this.current.stroke = true;
}

GameCanvas.prototype.strokeRect = function(x, y, width, height) {
    this.current.strokerect = true;
    this.current.rect.x = round(x);
    this.current.rect.y = round(y);
    this.current.rect.width = round(width);
    this.current.rect.height = round(height);
}

GameCanvas.prototype.fill = function() {
    this.current.fill = true;
}

GameCanvas.prototype.fillRect = function(x, y, width, height) {
    this.current.fillrect = true;
    this.current.rect.x = round(x);
    this.current.rect.y = round(y);
    this.current.rect.width = round(width);
    this.current.rect.height = round(height);
}

GameCanvas.prototype.fillText = function(text, x, y) {
//    this.current.text.text = text;
//    this.current.text.x = x;
//    this.current.text.y = y;
    var rx = round(x);
    var ry = round(y);
    this.ctx.fillText(text, rx, ry);
//    this.current.filltext = true;
}





GameCanvas.prototype.getData = function() {
    this.commit();
    return this.canvas;
}

GameCanvas.prototype.drawImage = function(data, x, y, w, h, xx, yy, ww, hh) {
    x = clamp(x);
    y = clamp(y);
    w = clamp(w);
    h = clamp(h);
    xx = clamp(xx);
    yy = clamp(yy);
    ww = clamp(ww);
    hh = clamp(hh);
    if (xx && yy && ww && hh) this.ctx.drawImage(data.canvas, x, y, w, h, xx, yy, ww, hh);
    else this.ctx.drawImage(data.canvas, x, y, w, h);
}

GameCanvas.prototype.blur = function(target, blur) {
    blurCanvas(this, target, blur);
}