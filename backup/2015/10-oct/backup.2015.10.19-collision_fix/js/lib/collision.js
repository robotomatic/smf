function collide(item1, item2, usecolliders) {
    return (collideRough(item1, item2)) ? collideFine(item1, item2, usecolliders) : null;
}

function collideRough(item1, item2) {
    return ((item1.x < item2.x + item2.width && item1.x + item1.width > item2.x) ||
            (item1.y < item2.y + item2.height &&item1.height + item1.y > item2.y));
}

function collideFine(item1, item2, usecolliders) {
    var item1h = item1;
    var item1v = item1;
    if (item1.collisionbox && usecolliders) {
        if (item1.colliders["horizontal"]) item1h = item1.colliders["horizontal"];
        if (item1.colliders["vertical"]) item1v = item1.colliders["vertical"];
        item1h.velX = item1.velX;
        item1v.velY = item1.velY;
    }
    var colH = this.collideFineHorizontal(item1h, item2);
    var colV = this.collideFineVertical(item1v, item2);
    if (colH || colV) return { horizontal : colH, vertical : colV };
}

function collideFineHorizontal(item1, item2) {
    var vX = (item1.x + (item1.width / 2)) - (item2.x + (item2.width / 2));
    var vY = (item1.y + (item1.height / 2)) - (item2.y + (item2.height / 2));
    var hWidths = (item1.width / 2) + (item2.width / 2);
    var hHeights = (item1.height / 2) + (item2.height / 2);
    var colDir = null;
    var colAmt = 0;
    if (Math.abs(vX) < hWidths) {
        var oX = hWidths - Math.abs(vX);
        var oY = hHeights - Math.abs(vY);
        
        if (oX < oY  && item2.collide != "top") {
            colAmt = oX;
            if (item1.velX < 0) {
                if (vX >= 0) colDir = "l";
                else if (vX <= 0) colDir = "r";
            } else {
                if (vX <= 0) colDir = "r";
                else if (vX >= 0) colDir = "l";
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
    var colDir = null;
    var colAmt = 0;
    if (Math.abs(vY) < hHeights) {
        var oX = hWidths - Math.abs(vX);
        var oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            colAmt = oY;
            if (item1.velY < 0) {
                if (vY >= 0 && item2.collide != "top") colDir = "t";
            } else {
                if (vY <= 0) colDir = "b";
            }
        }
    }
    return colAmt > 0 ? {"direction" : colDir, "amount" : colAmt} : null;
}