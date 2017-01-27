function ItemAnimator() {}

ItemAnimator.prototype.animate = function(step, item) {
    
    if (!item.currentaction) {
        item.actionnum = 0;
        item.originx = item.x;
        item.originy = item.y;
        item.velx = 0;
        item.vely = 0;
        item.angle = 0;
    }

    item.currentaction = item.actions[item.actionnum];
    var action = item.currentaction;
    var speed = action.speed;
    
    var amount = .1;
    
    if (action.x) {
        var ax = Number(action.x);
        
        var ca = clamp(item.originx + ax);
        var cx = clamp(item.x);
        
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

        item.x += item.velx;
        
        if (item.collisions && item.collisions.length) {
            for (var i = 0; i < item.collisions.length; i++) {
                if (!item.collisions[i]) continue;
                var player = item.collisions[i].player;
                if (!player) continue;
                var dx = item.collisions[i].dx;
                var diff = item.x - dx;
                if (Math.abs(player.velX) < 1) player.x = diff;
            }
        }
    } else if (action.y) {
        var ay = Number(action.y);
        
        var ca = clamp(item.originy + ay);
        var cy = clamp(item.y);
        
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

        item.y += item.vely;
        
        if (item.collisions && item.collisions.length) {
            for (var i = 0; i < item.collisions.length; i++) {
                if (!item.collisions[i]) continue;
                var player = item.collisions[i].player;
                if (!player) continue;
                
                player.jumpstarty = item.y;
                player.groundpoint.y = item.y;
                player.y = clamp(item.y - player.height);
                player.falling = false;
                player.grounded = true;
            }
        }
    } else if (action.rotate) {
        item.angle += Number(action.rotate);
        if (item.angle > 360) item.angle = 0;
        else if (item.angle < 0) item.angle = 360;
    }
}