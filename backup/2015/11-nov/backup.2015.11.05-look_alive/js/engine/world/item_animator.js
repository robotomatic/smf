function ItemAnimator() {
    
}

ItemAnimator.prototype.animate = function(step, item) {
    
    if (!item.currentaction) {
        item.actionnum = 0;
        item.actionstart = timestamp();
        item.originx = item.x;
        item.originy = item.y;
        item.offsetx = 0;
        item.offsety = 0;
    }

    var elapsed = timestamp();
    var dt = (elapsed - item.actionstart) / 1000;
    
    item.currentaction = item.actions[item.actionnum];
    var action = item.currentaction;
    var duration = action.duration;
    var percent = dt / duration;
    
    if (action.x) {
        var distance = Math.abs(action.x);
        var amt = distance / duration * percent;
        
        // todo: lerp this a bit - should slow down at ends
        
        var ax = Number(action.x);
        if (ax < 0) {
            
            // increase velX, add to offsetX
            // use max speed instead of duration? or both?
            
            
            item.x = item.originx - amt;
            item.offsetx = amt;
        } else {
            item.x = item.originx + amt - item.offsetx;
        }

        
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
    }
    
    if (action.y) {
        var distance = Math.abs(action.y);
        var amt = distance / duration * percent;
        var ay = Number(action.y);
        if (ay < 0) {
            item.y = item.originy - amt;
            item.offsety = amt;
        } else {
            item.y = item.originy + amt - item.offsety;
        }

        if (item.collisions && item.collisions.length) {
            for (var i = 0; i < item.collisions.length; i++) {
                if (!item.collisions[i]) continue;
                var player = item.collisions[i].player;
                if (!player) continue;
                 player.jumpstarty = item.y;
                 player.groundpoint.y = item.y;
                player.y = item.y - player.height;
            }
        }
    }
    
    
    if (dt > duration) {
        if (item.actionnum < item.actions.length - 1) item.actionnum = item.actionnum + 1;
        else item.actionnum = 0;
        item.actionstart = timestamp();
    }
    
    
    
}