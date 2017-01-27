"use strict";

function Collider() {
    this.vertical = {
        direction : "",
        amount : 0,
        y : null
    }
    this.horizontal = {
        direction : "",
        amount : 0
    };
}

Collider.prototype.collided = function() {
    return this.vertical.amount > 0 || this.horizontal.amount > 0 || this.vertical.direction != "" || this.horizontal.direction != "";
}

Collider.prototype.reset = function() {
    this.vertical.direction = "";
    this.vertical.amount = 0;
    this.vertical.y = null;
    this.horizontal.direction = "";
    this.horizontal.amount = 0;
}










function collide(item1, item2, result) {
    if (collideRough(item1, item2)) {
        result = collideFine(item1, item2, result);
    }
    
    return result;
}

function collideRough(item1, item2) {
    
    var minX1 = clamp(item1.x - 1);
    var maxX1 = clamp(item1.x + item1.width + 2);
    var minX2 = clamp(item2.x - 1);
    var maxX2 = clamp(item2.x + item2.width + 2);
    var minY1 = clamp(item1.y - 1);
    var maxY1 = clamp(item1.y + item1.height + 2);
    var minY2 = clamp(item2.y - 1);
    var maxY2 = clamp(item2.y + item2.height + 2);
    
    var ok = !(minX2 > maxX1 || maxX2 < minX1 || minY2 > maxY1 || maxY2 < minY1);
    return ok;
}

function collideFine(item1, item2, result) {
    
    
    if (item2.ramp) {
        if (item2.ramp == "left" || item2.ramp == "top-right") {
            if (item1.x > item2.x) {
                result = collideFineAngle(item1, item2, result);
                return result;
            }
        } else if (item2.ramp == "right" || item2.ramp == "top-left") {
            if ((item1.x + (item1.width / 2)) < (item2.x + item2.width)) {
                result = collideFineAngle(item1, item2, result);
                return result;
            }
        }
    }

    result = collideFineVertical(item1, item2, result);
    var dir = result.vertical.direction;
    if (dir) return result;

    result = collideFineHorizontal(item1, item2, result);
    return result;
}


function collideFineVertical(item1, item2, result) {
    if (item2.collide == "top") result = collideFineVerticalTop(item1, item2, result); 
    else result = collideFineVerticalBlock(item1, item2, result); 
    return result;
}


function collideFineVerticalTop(item1, item2, result) {

    if (item1.velY < 0) return result;
    
    var ix = item1.x + (item1.width / 2);
    var ih = item1.height;
    var iy1 = item1.y + (ih / 2);
    var iy2 = item1.y + ih + 1;

    var res = getLineIntersection(ix, iy1, ix, iy2, item2.x, item2.y, item2.x + item2.width, item2.y);
    if (res && res.onLine1 && res.onLine2) {
        result.vertical.direction = 'b';
        result.vertical.amount = res.y - (item1.y + item1.height);
        result.vertical.y = res.y;
    }

    return result;
}

function collideFineVerticalBlock(item1, item2, result) {
    
    
    var vX = (item1.x + (item1.width / 2)) - (item2.x + (item2.width / 2));
    var vY = (item1.y + (item1.height / 2)) - (item2.y + (item2.height / 2));
    var hWidths = (item1.width / 2) + (item2.width / 2);
    var hHeights = (item1.height / 2) + (item2.height / 2);

    var ih = item1.height / 2;
    
    vX = clamp(vX);
    vY = clamp(vY);
    hWidths = clamp(hWidths);
    hHeights = clamp(hHeights);
    
    var colDir = null;
    var colAmt = 0;
    var colY = 0;
    if (Math.abs(vY) < hHeights) {
        var oX = hWidths - Math.abs(vX);
        var oY = hHeights - Math.abs(vY);
        
        oX = clamp(oX);
        oY = clamp(oY);
        
        if (oX > oY) {
            colAmt = oY;
            if (item1.velY < 0 && vY >= 0) {
                colDir = "t";
                colY = item2.y + item2.height;
                colAmt = item1.y - colY;
            } else if (item1.velY >= 0 && vY <= 0) {
                colDir = "b";
                colY = item2.y;
                colAmt = (item1.y + item1.height) - colY;
            }
        }
    }

    if (colDir) {
        result.vertical.direction = colDir;
        result.vertical.amount = colAmt;
        result.vertical.y = colY;
    }
    
    return result;
}






function collideFineHorizontal(item1, item2, result) {

    var vX = (item1.x + (item1.width / 2)) - (item2.x + (item2.width / 2));
    var vY = (item1.y + (item1.height / 2)) - (item2.y + (item2.height / 2));
    var hWidths = (item1.width / 2) + (item2.width / 2);
    var hHeights = (item1.height / 2) + (item2.height / 2);
    
    vX = clamp(vX);
    vY = clamp(vY);
    
    if (vY < 0) return result;
    
    hWidths = clamp(hWidths);
    hHeights = clamp(hHeights);

    var colDir = null;
    var colAmt = 0;
    if (Math.abs(vX) < hWidths) {
        var oX = hWidths - Math.abs(vX);
        var oY = hHeights - Math.abs(vY);

        oX = clamp(oX);
        oY = clamp(oY);
        
        if (oX < oY  && item2.collide != "top") {
            colAmt = oX;
            if (item1.velX < 0) {
                if (vX >= 0) colDir = "l";
            } else {
                if (vX <= 0) colDir = "r";
            }
        }
        
    }
    
    if (colDir) {
        result.horizontal.direction = colDir;
        result.horizontal.amount = colAmt;
    } else {
        result.horizontal.direction = "";
        result.horizontal.amount = 0;
    }
    
    return result;
}



function collideFineAngle(item1, item2, result) {
    var p1x = item1.x + (item1.width / 2);
    var p1y = item1.y;
    var p2x = p1x;
    var p2y = item1.y + item1.height;
    var a1x;
    var a1y;
    var a2x;
    var a2y;
    if (item2.ramp == "left" || item2.ramp == "top-right") {
        a1x = item2.x + item2.width;
        a1y = item2.y + item2.height;
        a2x = item2.x;
        a2y = item2.y;
    } else if (item2.ramp == "right" || item2.ramp == "top-left") {
        a1x = item2.x;
        a1y = item2.y + item2.height;
        a2x = item2.x + item2.width;
        a2y = item2.y;
    }
    var res = getLineIntersection(p1x, p1y, p2x, p2y, a1x, a1y, a2x, a2y);
    if (res) {
        if (res.onLine1 && res.onLine2) {
            if (item1.velY >= 0) {
                result.vertical.direction = "b";
                result.vertical.amount = res.y - p2y;
                result.vertical.y = res.y;
            }
        }
    }
    return result;
}


function getProjectedPoint(item1, item2) {

    var p1x = item1.x + (item1.width / 2);
    var p1y = item1.y;
    var p2x = p1x;
    var p2y = item1.y + item1.height;
    
    var a1x;
    var a1y;
    var a2x;
    var a2y;
    if (item2.ramp == "left" || item2.ramp == "top-right") {
        a1x = item2.x + item2.width;
        a1y = item2.y + item2.height;
        a2x = item2.x;
        a2y = item2.y;
    } else if (item2.ramp == "right" || item2.ramp == "top-left") {
        a1x = item2.x;
        a1y = item2.y + item2.height;
        a2x = item2.x + item2.width;
        a2y = item2.y;
    } else {
        a1x = item2.x;
        a1y = item2.y;
        a2x = item2.x + item2.width;
        a2y = item2.y;
    }
    var res = getLineIntersection(p1x, p1y, p2x, p2y, a1x, a1y, a2x, a2y);
    if (res) {
//        if (item1.velY >= 0) return res;
        return res;
    }
    return -1;
}




function getLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {

    var denominator;
    var a;
    var b;
    var numerator1;
    var numerator2;
    
    var result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) return result;
    
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
    
    if (a > 0 && a < 1) result.onLine1 = true;
    if (b > 0 && b < 1) result.onLine2 = true;

    return result;
};