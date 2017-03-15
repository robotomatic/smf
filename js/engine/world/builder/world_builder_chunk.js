"use strict";

function WorldBuilderChunk() {
    
    //
    // todizzle: 
    // - height no workee?
    // - overflow 
    // - offset (extrude)
    //
    
    this.dochunk = true;
    this.chunksize = {
        width: 300,
        height: 0,
        depth : 300
    }
}

WorldBuilderChunk.prototype.chunk = function(world) { 
    var items = world.items;
    if (!this.dochunk) return items;
    var chunksize = this.chunksize;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.draw === false) continue;
        if (item.width == "100%" || item.height == "100%" || item.depth == "100%") continue;
        items = this.chunkItem(items, item, chunksize);
    }
    world.items = items;
}

WorldBuilderChunk.prototype.chunkItem = function(items, item, chunksize) { 
    if (chunksize.width && item.width > chunksize.width) {
        items = this.chunkItemX(items, item, chunksize);
    }
    if (chunksize.height && item.height > chunksize.height) {
        items = this.chunkItemY(items, item, chunksize);
    }
    if (chunksize.depth && item.depth > chunksize.depth) {
        items = this.chunkItemZ(items, item, chunksize);
    }
    return items;
}

WorldBuilderChunk.prototype.chunkItemX = function(items, item, chunksize) { 
    
    if (item.width <= chunksize.width) return items;
    
    var newt = item.width / chunksize.width;
    var ttt = floor(newt);
    var leftover = newt - ttt;
    for (var i = 1; i < ttt; i++) {
        var newitem = item.clone();
        
        if (!newitem || !newitem.parts) continue;
        
        newitem.x = item.x + chunksize.width * i;
        
        var newparts = new Array();
        for (var ii = 0; ii < newitem.parts.length; ii++) {
            var part = newitem.parts[ii];
            if (part.x > chunksize.width * (i + 1)) continue;
            if (part.x + part.width < chunksize.width) continue;
            if (part.width > chunksize.width) {
                var d = part.x + part.width - chunksize.width;
                part.width -= d;
                part.x = chunksize.width * ii;
            }
            newparts.push(part);
        }
        if (newparts.length) {
            newitem.parts = newparts;
            newitem.initialize();
            newitem.geometry.visible.left.visible = false;
            newitem.geometry.visible.right.visible = false;
            if (i == (ttt - 1) && !leftover) newitem.geometry.visible.right.visible = item.geometry.visible.right.visible;
            items.push(newitem);
        }
    }
    
    if (isDecimal(newt)) {
        // todo
        console.log("Chunk Overflow -- X : " + newt);
    }
    
    if (item.parts) {
        var newparts = new Array();
        for (var i = 0; i < item.parts.length; i++) {
            var part = item.parts[i];
            if (part.x > chunksize.width) continue;
            if (part.x + part.width > chunksize.width) {
                var d = part.x + part.width - chunksize.width;
                part.width -= d;
                newparts.push(part);
            } else {
                newparts.push(part);
            }
        }
        item.parts = newparts;
    }
    item.geometry.visible.right.visible = false;
    item.initialize();
    
    return items;
}

WorldBuilderChunk.prototype.chunkItemY = function(items, item, chunksize) { 

    if (item.height <= chunksize.height) return items;
    
    var newt = item.height / chunksize.height;
    var ttt = floor(newt);
    var leftover = newt - ttt;
    for (var i = 1; i < ttt; i++) {
        var newitem = item.clone();
        
        if (!newitem || !newitem.parts) continue;
        
        newitem.dotheme = false;
        
        newitem.y = item.y + (chunksize.height * i);
        
        var newparts = new Array();
        for (var ii = 0; ii < newitem.parts.length; ii++) {
            var part = newitem.parts[ii];
            if (part.y > chunksize.height * (i + 1)) continue;
            if (part.y + part.height < chunksize.height) continue;
            if (part.height > chunksize.height) {
                var d = part.y + part.height - chunksize.height;
                part.height -= d;
                part.y = chunksize.height * ii;
            }
            newparts.push(part);
        }
        if (newparts.length) {
            newitem.parts = newparts;
            newitem.initialize();
            newitem.geometry.visible.top.visible = false;
            items.push(newitem);
        }
    }
    
    if (isDecimal(newt)) {
        var newitem = item.clone();
        newitem.dotheme = false;
        newitem.y = item.y + (chunksize.height * ttt);
        
        var newparts = new Array();
        for (var ii = 0; ii < newitem.parts.length; ii++) {
            var part = newitem.parts[ii];
            if (part.y < chunksize.height * ttt) {
                if (part.y + part.height > chunksize.height) {
                    part.height = chunksize.height * leftover;
                    part.y = chunksize.height * ii;
                    newparts.push(part);
                }
            }
        }
        if (newparts.length) {
            newitem.parts = newparts;
            newitem.initialize();
            newitem.geometry.visible.top.visible = false;
            items.push(newitem);
        }
    }
    
    if (item.parts) {
        var newparts = new Array();
        for (var i = 0; i < item.parts.length; i++) {
            var part = item.parts[i];
            if (part.y > chunksize.height) continue;
            if (part.y + part.height > chunksize.height) {
                var d = part.y + part.height - chunksize.height;
                part.height -= d;
                newparts.push(part);
            } else {
                newparts.push(part);
            }
        }
        item.parts = newparts;
    }
    item.initialize();
    item.geometry.visible.bottom.visible = false;
    
    return items;
}

WorldBuilderChunk.prototype.chunkItemZ = function(items, item, chunksize) { 
    if (item.depth <= chunksize.depth) return items;
    var newt = item.depth / chunksize.depth;
    var ttt = floor(newt);
    var leftover = newt - ttt;
    for (var i = 1; i < ttt; i++) {
        var newitem = item.clone();
        if (!newitem) continue;
        newitem.z = item.z + (chunksize.depth * i);
        newitem.depth = chunksize.depth;
        newitem.initialize();
        newitem.geometry.visible.front.visible = false;
        newitem.geometry.visible.back.visible = false;
        if (i == (ttt - 1) && !leftover) newitem.geometry.visible.back.visible = item.geometry.visible.back.visible;
        items.push(newitem);
    }
    
    if (isDecimal(newt)) {
        var newitem = item.clone();
        newitem.z = item.z + (chunksize.depth * ttt);
        newitem.depth = chunksize.depth * leftover;
        newitem.initialize();
        newitem.geometry.visible.front.visible = false;
        items.push(newitem);
    }
    
    item.depth = chunksize.depth;
    item.initialize();
    item.geometry.visible.back.visible = false;
    return items;
}
