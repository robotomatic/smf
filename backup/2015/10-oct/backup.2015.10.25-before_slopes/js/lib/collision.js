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
                    if (colAmt < 10) colDir = "b";
                } else colDir = "b";
            }
        }
    }
    return colAmt > 0 ? {"direction" : colDir, "amount" : colAmt} : null;
}