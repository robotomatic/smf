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
    this.ctx.beginPath();
}



GameCanvas.prototype.beginPath = function() {
    this.ctx.beginPath();
}

GameCanvas.prototype.closePath = function() {
    this.ctx.closePath();
}

GameCanvas.prototype.setAlpha = function(alpha) {
    this.ctx.globalAlpha = alpha;
}

GameCanvas.prototype.setCompositeOperation = function(op) {
    this.ctx.globalCompositeOperation = op;
}

GameCanvas.prototype.setFillStyle = function(color) {
    this.ctx.fillStyle = color;
}

GameCanvas.prototype.setStrokeStyle = function(color) {
    this.ctx.strokeStyle = color;
}

GameCanvas.prototype.setLineWidth = function(width) {
    this.ctx.lineWidth = width;
}

GameCanvas.prototype.setLineCap = function(cap) {
    this.ctx.lineCap = cap;
}

GameCanvas.prototype.setFont = function(font) {
    this.ctx.font = font;
}


GameCanvas.prototype.createLinearGradient = function(x, y, width, height) {
    return this.ctx.createLinearGradient(x, y, width, height);
}

GameCanvas.prototype.createRadialGradient = function(x0, y0, r0, x1, y1, r1) {
    return this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
}

GameCanvas.prototype.save = function() {
    this.ctx.save();
}

GameCanvas.prototype.clip = function() {
    this.ctx.clip();
}

GameCanvas.prototype.restore = function() {
    this.ctx.restore();
}

GameCanvas.prototype.stroke = function() {
    this.ctx.stroke();
}

GameCanvas.prototype.strokeRect = function(x, y, width, height) {
    this.ctx.strokeRect(x, y, width, height);
}

GameCanvas.prototype.fill = function() {
    this.ctx.fill();
}

GameCanvas.prototype.moveTo = function(x, y) {
    this.ctx.moveTo(x, y);
}

GameCanvas.prototype.bezierCurveTo = function(x1, y1, x2, y2, x3, y3) {
    this.ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
}

GameCanvas.prototype.quadraticCurveTo = function(x1, y1, x2, y2) {
    this.ctx.quadraticCurveTo(x1, y1, x2, y2);
}

GameCanvas.prototype.lineTo = function(x, y) {
    this.ctx.lineTo(x, y);
}

GameCanvas.prototype.arc = function(x, y, radius, start, end, ccw) {
    this.ctx.arc(x, y, radius, start, end, ccw);
}

GameCanvas.prototype.fillRect = function(x, y, width, height) {
    this.ctx.fillRect(x, y, width, height);
}

GameCanvas.prototype.fillText = function(text, x, y) {
    this.ctx.fillText(text, x, y);
}






GameCanvas.prototype.drawImage = function(data, x, y, w, h, xx, yy, ww, hh) {
    this.ctx.drawImage(data, x, y, w, h, xx, yy, ww, hh);
}