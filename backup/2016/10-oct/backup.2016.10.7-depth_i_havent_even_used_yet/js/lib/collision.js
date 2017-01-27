"use strict";

function Collider() {
    this.vertical = {
        direction : "",
        amount : 0,
        y : 0
    }
    this.horizontal = {
        direction : "",
        amount : 0,
        x : 0
    }
    this.depth = {
        direction : "",
        amount : 0,
        z : 0
    };
}

Collider.prototype.collided = function() {
    return this.vertical.amount > 0 || this.horizontal.amount > 0 || this.depth.amount > 0 || 
        this.vertical.direction != "" || this.horizontal.direction != ""|| this.depth.direction != "";
}

Collider.prototype.reset = function() {
    this.vertical.direction = "";
    this.vertical.amount = 0;
    this.vertical.y = null;
    this.horizontal.direction = "";
    this.horizontal.amount = 0;
    this.horizontal.x = null;
    this.depth.direction = "";
    this.depth.amount = 0;
    this.depth.x = null;
}

function collide(item1, item2, result) {
    
    result.horizontal.direction = "";
    result.horizontal.amount = 0;
    result.horizontal.x = 0;
    result.vertical.direction = "";
    result.vertical.amount = 0;
    result.vertical.y = 0;
    result.depth.direction = "";
    result.depth.amount = 0;
    result.depth.z = 0;
    
    if (!collideRough(item1, item2)) return result;
    result = collideFine(item1, item2, result);
    return result;
}

function collideRough(item1, item2, pad) {

    if (!pad) pad = 2;
    var hp = pad / 2;
    
    var minX1 = clamp(item1.x - hp);
    var maxX1 = clamp(item1.x + item1.width + pad);
    var minX2 = clamp(item2.x - hp);
    var maxX2 = clamp(item2.x + item2.width + pad);
    if (maxX2 < minX1 || minX2 > maxX1) return false;
    
    var minY1 = clamp(item1.y - hp);
    var maxY1 = clamp(item1.y + item1.height + pad);
    var minY2 = clamp(item2.y - hp);
    var maxY2 = clamp(item2.y + item2.height + pad);
    if (maxY2 < minY1 || minY2 > maxY1) return false;
    
    var minZ1 = clamp(item1.z);
    var maxZ1 = clamp(item1.z + item1.depth);
    
    var minZ2 = clamp(item2.z - hp);
    var maxZ2 = clamp(item2.z + item2.depth + pad);
    if (maxZ2 < minZ1 || minZ2 > maxZ1) return false;

    return true;
}

function collideFine(item1, item2, result) {
    
    
//    if (item2.ramp) {
//        if (item2.ramp == "left" || item2.ramp == "top-right") {
//            if (item1.x > item2.x) {
//                result = collideFineAngle(item1, item2, result);
//                return result;
//            }
//        } else if (item2.ramp == "right" || item2.ramp == "top-left") {
//            if ((item1.x + (item1.width / 2)) < (item2.x + item2.width)) {
//                result = collideFineAngle(item1, item2, result);
//                return result;
//            }
//        }
//    }

    result = collideFineVertical(item1, item2, result);
    if (result.vertical.direction) return result;
    result = collideFineHorizontal(item1, item2, result);
    if (result.horizontal.direction) return result;
    result = collideFineDepth(item1, item2, result);
    return result;
}


function collideFineVertical(item1, item2, result) {
    var vY = clamp((item1.y + (item1.height / 2)) - (item2.y + (item2.height / 2)));
    var hHeights = clamp((item1.height / 2) + (item2.height / 2));
    var ih = item1.height / 2;
    if (Math.abs(vY) < hHeights) {
        var oY = clamp(hHeights - Math.abs(vY));
        if (oY) {
            var colDir = null;
            var colY = 0;
            var colAmt = oY;
            if (item1.velY < 0 && vY >= 0) {
                colDir = "t";
                colY = item2.y + item2.height;
                colAmt = item1.y - colY;
            } else if (item1.velY >= 0 && vY <= 0) {
                colDir = "b";
                colY = item2.y;
                colAmt = (item1.y + item1.height) - colY;
            }
            result.vertical.direction = colDir;
            result.vertical.amount = colAmt;
            result.vertical.y = colY;
        }
    }
    return result;
}

function collideFineHorizontal(item1, item2, result) {
    var vX = clamp((item1.x + (item1.width / 2)) - (item2.x + (item2.width / 2)));
    var hWidths = clamp((item1.width / 2) + (item2.width / 2));
    if (Math.abs(vX) < hWidths) {
        var oX = clamp(hWidths - Math.abs(vX));
        if (oX) {
            var colDir = null;
            var colX = 0;
            var colAmt = oX;
            if (item1.velX < 0 && vX >= 0) {
                colDir = "l";
                colX = item2.x + item2.width;
                colAmt = item1.x - colX;
            } else if (item1.velX >= 0 && vX <= 0) {
                colDir = "r";
                colX = item2.x;
                colAmt = (item1.x + item1.width) - colX;
            }
            result.horizontal.direction = colDir;
            result.horizontal.amount = colAmt;
            result.horizontal.x = colX;
        }
        
    }
    return result;
}

function collideFineDepth(item1, item2, result) {
    var vZ = clamp((item1.z + (item1.depth / 2)) - (item2.z + (item2.depth / 2)));
    var hDepths = clamp((item1.depth / 2) + (item2.depth / 2));
    var id = item1.depth / 2;
    if (Math.abs(vZ) < hDepths) {
        var oZ = clamp(hDepths - Math.abs(vZ));
        if (oZ) {
            var colDir = null;
            var colZ = 0;
            var colAmt = oZ;
            if (item1.velZ < 0 && vZ >= 0) {
                colDir = "o";
                colZ = item2.z + item2.depth;
                colAmt = item1.z - colZ;
            } else if (item1.velZ >= 0 && vZ <= 0) {
                colDir = "i";
                colZ = item2.z;
                colAmt = (item1.z + item1.depth) - colZ;
            }
            result.depth.direction = colDir;
            result.depth.amount = colAmt;
            result.depth.z = colZ;
        }
    }
    return result;
}


//function collideFineAngle(item1, item2, result) {
//    var p1x = item1.x + (item1.width / 2);
//    var p1y = item1.y;
//    var p2x = p1x;
//    var p2y = item1.y + item1.height;
//    var a1x;
//    var a1y;
//    var a2x;
//    var a2y;
//    if (item2.ramp == "left" || item2.ramp == "top-right") {
//        a1x = item2.x + item2.width;
//        a1y = item2.y + item2.height;
//        a2x = item2.x;
//        a2y = item2.y;
//    } else if (item2.ramp == "right" || item2.ramp == "top-left") {
//        a1x = item2.x;
//        a1y = item2.y + item2.height;
//        a2x = item2.x + item2.width;
//        a2y = item2.y;
//    }
//    var res = getLineIntersection(p1x, p1y, p2x, p2y, a1x, a1y, a2x, a2y);
//    if (res) {
//        if (res.onLine1 && res.onLine2) {
//            if (item1.velY >= 0) {
//                result.vertical.direction = "b";
//                result.vertical.amount = res.y - p2y;
//                result.vertical.y = res.y;
//            }
//        }
//    }
//    return result;
//}