"use strict";

function ItemAnimator() {
    
    this.last = null;
    
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

    speed = 5;
    
    if (action.x) this.animateX(now, step, item, action, speed, amount);
    if (action.y) this.animateY(now, step, item, action, speed, amount);
    if (action.rotate) this.animateRotate(now, step, item, action, speed, amount);
    
    this.last = now;
}

ItemAnimator.prototype.animateX = function(now, step, item, action, speed, amount) {
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
    

    var newx = round(item.x + item.velx);
    var lx = (newx - item.x) / 2;
    item.x += lx;
}

ItemAnimator.prototype.animateY = function(now, step, item, action, speed, amount) {
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

    var newy = round(item.y + item.vely);
    var ly = (newy - item.y) / 2;
    item.y += ly;
}

ItemAnimator.prototype.animateRotate = function(now, step, item, action, speed, amount) {
    // todo: not rotating?
    item.angle = clamp(item.angle + Number(action.rotate));
    if (item.angle > 360) item.angle = 0;
    else if (item.angle < 0) item.angle = 360;
}
