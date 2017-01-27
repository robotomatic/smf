"use strict";

function ItemAnimator() {}

ItemAnimator.prototype.animate = function(step, item) {
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

    // todo: lerp
    
    if (action.x) {
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
//        item.x = clamp(item.x + item.velx);
        item.x = item.x + item.velx;
    } else if (action.y) {
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
//        item.y = clamp(item.y + item.vely);
        item.y = item.y + item.vely;
    } else if (action.rotate) {
        
        // todo: not rotating?
        
        item.angle = clamp(item.angle + Number(action.rotate));
        if (item.angle > 360) item.angle = 0;
        else if (item.angle < 0) item.angle = 360;
    }
}