"use strict";

function ItemAnimator() {
    
    
}

ItemAnimator.prototype.animate = function(now, step, item) {

    if (!item.action) {
        item.actionnum = 0;
        item.originx = item.x;
        item.originy = item.y;
        item.velx = 0;
        item.vely = 0;
        item.angle = 0;
    }

    item.action = item.actions[item.actionnum];
    var action = item.action;
    var speed = action.speed;
    var amount = .1;

//    speed = 1;

    if (item.last) {
        
        var delta = (now - item.last) / 50;
        if (delta > 10) delta = 1;
        
        if (action.x) this.animateX(delta, item, action, speed, amount);
        if (action.y) this.animateY(delta, item, action, speed, amount);
        if (action.rotate) this.animateRotate(delta, item, action, speed, amount);
    }
    
    item.last = now;
}

ItemAnimator.prototype.animateX = function(delta, item, action, speed, amount) {
    var ax = Number(action.x);
    var ca = item.originx + ax;
    var cx = item.x;
    if (ax < 0) {
        if (ca < cx) {
            if (item.velx > -speed) item.velx = item.velx - amount;
        } else if (ca > cx) {
            item.velx += amount;
        if (item.actionnum < item.actions.length - 1) item.actionnum++;
        else item.actionnum = 0;
        } else {
            item.velx = 0;
            if (item.actionnum < item.actions.length - 1) item.actionnum++;
            else item.actionnum = 0;
        }
    } else {
        if (ca > cx) {
            if (item.velx< speed) item.velx = item.velx + amount;
        } else if (ca < cx) {
            item.velx -= amount;
            if (item.actionnum < item.actions.length - 1) item.actionnum++;
            else item.actionnum = 0;
        } else {
            item.velx = 0;
            if (item.actionnum < item.actions.length - 1) item.actionnum++;
            else item.actionnum = 0;
        }
    }
    
    var dx = item.velx * delta;
    item.x = clamp(item.x + dx);
}

ItemAnimator.prototype.animateY = function(delta, item, action, speed, amount) {
    var ay = Number(action.y);
    var ca = item.originy + ay;
    var cy = item.y;
    if (ay < 0) {
        if (ca < cy) {
            if (item.vely > -speed) item.vely = item.vely - amount;
        } else {
            item.vely = 0;
            if (item.actionnum < item.actions.length - 1) item.actionnum++;
            else item.actionnum = 0;
        }
    } else {
        if (ca > cy) {
            if (item.vely < speed) item.vely = item.vely + amount;
        } else {
            item.vely = 0;
            if (item.actionnum < item.actions.length - 1) item.actionnum++;
            else item.actionnum = 0;
        }
    }
    
    var dy = item.vely * delta;
    item.y = clamp(item.y + dy);
}

ItemAnimator.prototype.animateRotate = function(delta, item, action, speed, amount) {
    // todo: not rotating?
    item.angle = clamp(item.angle + Number(action.rotate));
    if (item.angle > 360) item.angle = 0;
    else if (item.angle < 0) item.angle = 360;
}
