function distance(x1, y1, x2, y2) {
    return Math.sqrt( ( x2 -= x1 ) * x2 + ( y2 -= y1 ) * y2 );
}

function collide(item1, item2, usecolliders) {
    return (collideRough(item1, item2, usecolliders)) ? collideFine(item1, item2, usecolliders) : null;
}

function collideRough(item1, item2, usecolliders) {
    if (item1.collisionbox && usecolliders) if (item1.collisionbox.width > 0) item1 = item1.collisionbox;    
    var minX1 = clamp(item1.x);
    var maxX1 = clamp(item1.x + item1.width);
    var minX2 = clamp(item2.x);
    var maxX2 = clamp(item2.x + item2.width);
    var minY1 = clamp(item1.y);
    var maxY1 = clamp(item1.y + item1.height);
    var minY2 = clamp(item2.y);
    var maxY2 = clamp(item2.y + item2.height);
    return !(minX2 > maxX1 || 
            maxX2 < minX1 || 
            minY2 > maxY1 ||
            maxY2 < minY1);
}

function collideFine(item1, item2, usecolliders) {
    
    
    if (item2.ramp) {
        if (item2.ramp == "left") {
            if (item1.x > item2.x) return collideFineAngle(item1, item2);
        } else {
            if ((item1.x + (item1.width / 2)) < (item2.x + item2.width)) {
                return collideFineAngle(item1, item2);
            }
        }
    }

    var item1h = item1;
    var item1v = item1;

//    if (item1.collisionbox && usecolliders) {
//        if (item1.colliders["horizontal"]) item1h = item1.colliders["horizontal"];
//        if (item1.colliders["vertical"]) item1v = item1.colliders["vertical"];
//        item1h.velX = item1.velX;
//        item1v.velY = item1.velY;
//    }

    var colH = this.collideFineHorizontal(item1h, item2);
    var colV = this.collideFineVertical(item1v, item2);
    if (colH || colV) return { horizontal : colH, vertical : colV };
}

function collideFineHorizontal(item1, item2) {
    var vX = (item1.x + (item1.width / 2)) - (item2.x + (item2.width / 2));
    var vY = (item1.y + (item1.height / 2)) - (item2.y + (item2.height / 2));
    var hWidths = (item1.width / 2) + (item2.width / 2);
    var hHeights = (item1.height / 2) + (item2.height / 2);
    
    vX = clamp(vX);
    vY = clamp(vY);
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
    return colAmt > 0 ? {"direction" : colDir, "amount" : colAmt} : null;
}

function collideFineVertical(item1, item2) {
    var vX = (item1.x + (item1.width / 2)) - (item2.x + (item2.width / 2));
    var vY = (item1.y + (item1.height / 2)) - (item2.y + (item2.height / 2));
    var hWidths = (item1.width / 2) + (item2.width / 2);
    var hHeights = (item1.height / 2) + (item2.height / 2);
    
    vX = clamp(vX);
    vY = clamp(vY);
    hWidths = clamp(hWidths);
    hHeights = clamp(hHeights);
    
    var colDir = null;
    var colAmt = 0;
    if (Math.abs(vY) < hHeights) {
        var oX = hWidths - Math.abs(vX);
        var oY = hHeights - Math.abs(vY);
        
        oX = clamp(oX);
        oY = clamp(oY);
        
        if (oX > oY) {
            colAmt = oY;
            if (item1.velY < 0 && vY >= 0 && item2.collide != "top") colDir = "t";
            else if (item1.velY >= 0 && vY <= 0) {
                if (item2.collide == "top") {
//                    if (colAmt < 10) colDir = "b";
                    colDir = "b";
                } else colDir = "b";
            }
        }
    }
    return colAmt > 0 ? {"direction" : colDir, "amount" : colAmt} : null;
}


function collideFineAngle(item1, item2) {
    var p1 = {
        x : item1.x + (item1.width / 2),
        y : item1.y
    }
    var p2 = {
        x : p1.x,
        y : item1.y + item1.height
    }
    var a1 = {};
    var a2 = {};
    if (item2.ramp == "left") {
        a1.x = item2.x + item2.width;
        a1.y = item2.y + item2.height;
        a2.x = item2.x;
        a2.y = item2.y;
    } else {
        a1.x = item2.x;
        a1.y = item2.y + item2.height;
        a2.x = item2.x + item2.width;
        a2.y = item2.y;
    }
    var res = getLineIntersection(p1.x, p1.y, p2.x, p2.y, a1.x, a1.y, a2.x, a2.y);
    if (res) {
        if (res.onLine1 && res.onLine2) {
            if (item1.velY >= 0) return {vertical : { "direction" : "b", "amount" : res.y - p2.y, "y" : res.y }};
        }
    }
}


function getProjectedPoint(item1, item2) {
    var p1 = {
        x : item1.x + (item1.width / 2),
        y : item1.y
    }
    var p2 = {
        x : p1.x,
        y : item1.y + item1.height
    }
    var a1 = {};
    var a2 = {};
    if (item2.ramp == "left") {
        a1.x = item2.x + item2.width;
        a1.y = item2.y + item2.height;
        a2.x = item2.x;
        a2.y = item2.y;
    } else {
        a1.x = item2.x;
        a1.y = item2.y + item2.height;
        a2.x = item2.x + item2.width;
        a2.y = item2.y;
    }
    var res = getLineIntersection(p1.x, p1.y, p2.x, p2.y, a1.x, a1.y, a2.x, a2.y);
    if (res) {
        if (item1.velY >= 0) return res.y;
    }
    return -1;
}




function getLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {

    var denominator, a, b, numerator1, numerator2, result = {
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