"use strict";

function Triangle(x, y, width, height, info) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.info = info;
}


Triangle.prototype.path = function(ctx) {
    if (this.info == "left") {
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x, this.y);
    } else if (this.info == "left-top") {
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y);
    } else if (this.info == "right") {
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
    } else if (this.info == "right-top") {
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x, this.y + this.height);
    }
    ctx.closePath();
}

Triangle.prototype.draw = function(ctx) {
    this.path(ctx);
    ctx.fill();
}

Triangle.prototype.drawOutline = function(ctx, color, weight, opacity, scale) {
    this.path(ctx);
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    weight = scale ? weight * scale : weight;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
    if (opacity) ctx.globalAlpha = 1;
}

Triangle.prototype.pathRound = function(ctx) {
    var radius = 10;
    var hrad = radius / 2;
    if (triangle == "left") {
        ctx.moveTo(this.x + hrad, this.y);
        ctx.lineTo(this.x + this.width - hrad, this.y + this.height - hrad);
        ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - hrad, this.y + this.height);
        ctx.lineTo(this.x + hrad, this.y + height);
        ctx.quadraticCurveTo(this.x, this.y + height, this.x, this.y + this.height - hrad);
        ctx.lineTo(this.x, this.y + hrad);
        ctx.quadraticCurveTo(this.x, this.y, this.x + hrad, this.y);
    } else {
        ctx.moveTo(this.x + hrad, this.y + this.height - hrad);
        ctx.lineTo(this.x + this.width - hrad, this.y);
        ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + hrad);
        ctx.lineTo(this.x + this.width, this.y + this.height - hrad);
        ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - hrad, this.y + this.height);
        ctx.lineTo(this.x + hrad, this.y + this.height);
        ctx.quadraticCurveTo(this.x, this.y + this.height, this.x + hrad, this.y + this.height - hrad);
    }
    ctx.closePath();
}

Triangle.prototype.drawRound = function(ctx) {
    this.pathRound(ctx);
    ctx.fill();
}

Triangle.prototype.drawRoundOutline = function(ctx, color, weight, opacity, scale) {
    this.pathRound(ctx);
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    weight = scale ? weight * scale : weight;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
    if (opacity) ctx.globalAlpha = 1;
}