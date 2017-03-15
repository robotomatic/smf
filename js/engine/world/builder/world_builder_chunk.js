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
        width: 0,
        height: 100,
        depth : 0
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
    if (chunksize.width && item.width > chunksize.width) items = this.chunkItemX(items, item, chunksize);
    if (chunksize.height && item.height > chunksize.height) items = this.chunkItemY(items, item, chunksize);
    if (chunksize.depth && item.depth > chunksize.depth) items = this.chunkItemZ(items, item, chunksize);
    return items;
}

WorldBuilderChunk.prototype.chunkItemX = function(items, item, chunksize) { 
    
    if (item.width <= chunksize.width) return items;
    
    var newt = item.width / chunksize.width;
    for (var i = 1; i < newt; i++) {
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
        }
        items.push(newitem);
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
    item.initialize();
    
    return items;
}

WorldBuilderChunk.prototype.chunkItemY = function(items, item, chunksize) { 

    if (item.height <= chunksize.height) return items;
    
    var newt = item.height / chunksize.height;
//    for (var i = 1; i < newt; i++) {
//        var newitem = item.clone();
//        
//        if (!newitem || !newitem.parts) continue;
//        
//        newitem.y = item.y + chunksize.height * i;
//        
//        var newparts = new Array();
//        for (var ii = 0; ii < newitem.parts.length; ii++) {
//            var part = newitem.parts[ii];
//            if (part.y > chunksize.height * (i + 1)) continue;
//            if (part.y + part.height < chunksize.height) continue;
//            if (part.height > chunksize.height) {
//                var d = part.y + part.height - chunksize.height;
//                part.height -= d;
//                part.y = chunksize.height * ii;
//            }
//            newparts.push(part);
//        }
//        if (newparts.length) {
//            newitem.parts = newparts;
//            newitem.initialize();
//        }
//        items.push(newitem);
//    }
    
    if (isDecimal(newt)) {
        // todo
        console.log("Chunk Overflow -- Y : " + newt);
    }
    
    if (item.parts) {
        var newparts = new Array();
        for (var i = 0; i < item.parts.length; i++) {
            var part = item.parts[i];
            if (part.y > chunksize.height) continue;
            if (part.y + part.height > (chunksize.height * (i + 1))) {
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
    
    return items;
}

WorldBuilderChunk.prototype.chunkItemZ = function(items, item, chunksize) { 
    
    if (item.depth <= chunksize.depth) return items;
    
    var newt = item.depth / chunksize.depth;
    for (var i = 1; i < newt; i++) {
        var newitem = item.clone();
        
        if (!newitem) continue;

        newitem.z = item.z + chunksize.depth * i;
        newitem.depth = chunksize.depth;
        newitem.initialize();
        items.push(newitem);
    }
    
    if (isDecimal(newt)) {
        // todo
        console.log("Chunk Overflow -- Z : " + newt);
    }
    
    item.depth = chunksize.depth;
    item.initialize();
    
    return items;
}
