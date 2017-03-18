"use strict";

function Triangle(x, y, width, height, info) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.info = info;
}


Triangle.prototype.path = function(gamecanvas) {
    if (this.info == "left") {
        gamecanvas.moveTo(this.x, this.y);
        gamecanvas.lineTo(this.x + this.width, this.y + this.height);
        gamecanvas.lineTo(this.x, this.y + this.height);
        gamecanvas.lineTo(this.x, this.y);
    } else if (this.info == "left-top") {
        gamecanvas.moveTo(this.x, this.y);
        gamecanvas.lineTo(this.x + this.width, this.y);
        gamecanvas.lineTo(this.x + this.width, this.y + this.height);
        gamecanvas.lineTo(this.x, this.y);
    } else if (this.info == "right") {
        gamecanvas.moveTo(this.x, this.y + this.height);
        gamecanvas.lineTo(this.x + this.width, this.y);
        gamecanvas.lineTo(this.x + this.width, this.y + this.height);
        gamecanvas.lineTo(this.x, this.y + this.height);
    } else if (this.info == "right-top") {
        gamecanvas.moveTo(this.x, this.y + this.height);
        gamecanvas.lineTo(this.x, this.y);
        gamecanvas.lineTo(this.x + this.width, this.y);
        gamecanvas.lineTo(this.x, this.y + this.height);
    }
    gamecanvas.closePath();
}

Triangle.prototype.draw = function(gamecanvas) {
    this.path(gamecanvas);
    gamecanvas.fill();
}

Triangle.prototype.drawOutline = function(gamecanvas, color, weight, opacity, scale) {
    this.path(gamecanvas);
    gamecanvas.setLineCap("round");
    gamecanvas.setStrokeStyle(color);
    if (opacity) gamecanvas.setAlpha(opacity);
    weight = scale ? weight * scale : weight;
    gamecanvas.setLineWidth(weight ? weight : .2);
    gamecanvas.stroke();            
    if (opacity) gamecanvas.setAlpha(1);
}

Triangle.prototype.pathRound = function(gamecanvas) {
    var radius = 10;
    var hrad = radius / 2;
    if (triangle == "left") {
        gamecanvas.moveTo(this.x + hrad, this.y);
        gamecanvas.lineTo(this.x + this.width - hrad, this.y + this.height - hrad);
        gamecanvas.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - hrad, this.y + this.height);
        gamecanvas.lineTo(this.x + hrad, this.y + height);
        gamecanvas.quadraticCurveTo(this.x, this.y + height, this.x, this.y + this.height - hrad);
        gamecanvas.lineTo(this.x, this.y + hrad);
        gamecanvas.quadraticCurveTo(this.x, this.y, this.x + hrad, this.y);
    } else {
        gamecanvas.moveTo(this.x + hrad, this.y + this.height - hrad);
        gamecanvas.lineTo(this.x + this.width - hrad, this.y);
        gamecanvas.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + hrad);
        gamecanvas.lineTo(this.x + this.width, this.y + this.height - hrad);
        gamecanvas.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - hrad, this.y + this.height);
        gamecanvas.lineTo(this.x + hrad, this.y + this.height);
        gamecanvas.quadraticCurveTo(this.x, this.y + this.height, this.x + hrad, this.y + this.height - hrad);
    }
    gamecanvas.closePath();
}

Triangle.prototype.drawRound = function(gamecanvas) {
    this.pathRound(gamecanvas);
    gamecanvas.fill();
}

Triangle.prototype.drawRoundOutline = function(gamecanvas, color, weight, opacity, scale) {
    this.pathRound(gamecanvas);
    gamecanvas.setLineCap("round");
    gamecanvas.setStrokeStyle(color);
    if (opacity) gamecanvas.setAlpha(opacity);
    weight = scale ? weight * scale : weight;
    gamecanvas.setLineWidth(weight ? weight : .2);
    gamecanvas.stroke();            
    if (opacity) gamecanvas.setAlpha(1);
}