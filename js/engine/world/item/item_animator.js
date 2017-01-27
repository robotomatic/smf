"use strict";

function ItemAnimator() {
}

ItemAnimator.prototype.animate = function(now, item, delta) {

    var ip = item.getLocation();
    var ix = ip.x;
    var iy = ip.y;
    
    if (!item.action) {
        item.actionnum = 0;
        item.originx = ix;
        item.originy = iy;
        item.velX = 0;
        item.velY = 0;
        item.angle = 0;
    }

    item.action = item.actions[item.actionnum];
    var action = item.action;
    var speed = action.speed;

    if (!delta || delta < 0) delta = 1;

    var acceleration = .1;

    if (action.x) this.animateX(delta, item, action, speed, acceleration);
    if (action.y) this.animateY(delta, item, action, speed, acceleration);
    if (action.rotate) this.animateRotate(delta, item, action, speed, acceleration);
}

ItemAnimator.prototype.animateX = function(delta, item, action, speed, acceleration) {
    var ax = action.x;
    var ca = round(item.originx + ax);

    var cx = item.x;
    
    if (ax < 0) {
        if (ca < cx) {
            if (item.velX > -speed) item.velX -= acceleration;
        } else if (ca > cx) {
            if (item.velX < speed) item.velX += acceleration;
            if (item.actionnum < item.actions.length - 1) item.actionnum++;
            else item.actionnum = 0;
        }
    } else {
        if (ca > cx) {
            if (item.velX < speed) item.velX += acceleration;
        } else if (ca < cx) {
            if (item.velX > -speed) item.velX -= acceleration;
            if (item.actionnum < item.actions.length - 1) item.actionnum++;
            else item.actionnum = 0;
        }
    }
    item.velX = round(item.velX);
    var dx = item.velX * delta;
    item.x += dx;
    item.x = round(item.x);
}

ItemAnimator.prototype.animateY = function(delta, item, action, speed, acceleration) {
    var ay = action.y;
    var ca = item.originy + ay;

    var cy = item.y;
    
    if (ay < 0) {
        if (ca < cy) {
            if (item.velY > -speed) item.velY -= acceleration;
        } else if (ca > cy) {
            if (item.velY < speed) item.velY += acceleration;
            if (item.actionnum < item.actions.length - 1) item.actionnum++;
            else item.actionnum = 0;
        }
    } else {
        if (ca > cy) {
            if (item.velY < speed) item.velY += acceleration;
        } else if (ca < cy) {
            if (item.velY > -speed) item.velY -= acceleration;
            if (item.actionnum < item.actions.length - 1) item.actionnum++;
            else item.actionnum = 0;
        }
    }
    item.velY = round(item.velY);
    var dy = item.velY * delta;
    item.y += dy;
    item.y = round(item.y);
}

ItemAnimator.prototype.animateRotate = function(delta, item, action, speed, acceleration) {
    // todo: not rotating?
    item.angle = clamp(item.angle + Number(action.rotate));
    if (item.angle > 360) item.angle = 0;
    else if (item.angle < 0) item.angle = 360;
}
