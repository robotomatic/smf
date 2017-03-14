"use strict";

function WorldBuilderChunk() {
    this.dochunk = false;
    this.chunksize = {
        width: 100,
        height: 100,
        depth : 100
    }
}

WorldBuilderChunk.prototype.chunk = function(world) { 

    var items = world.items;
    
    // todo: no workee!!!
    
    if (!this.dochunk) return items;
    var chunksize = this.chunksize;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.draw === false) continue;
        if (item.width == "100%" || item.height == "100%" || item.depth == "100%") continue;
        var newitems = this.chunkItem(item, chunksize);
        if (newitems) items = items.concat(newitems);
    }
    world.items = items;
}

WorldBuilderChunk.prototype.chunkItem = function(item, chunksize) { 
    var newitems = new Array();
    if (item.width > chunksize.width) newitems = this.chunkItemX(item, chunksize, newitems);
    if (item.height > chunksize.height) newitems = this.chunkItemY(item, chunksize, newitems);
    if (item.depth > chunksize.depth) newitems = this.chunkItemZ(item, chunksize, newitems);
    return newitems;
}

WorldBuilderChunk.prototype.chunkItemX = function(item, chunksize, newitems) { 

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
            if (part.x + part.width > chunksize.width) {
                var d = part.x + part.width - chunksize.width;
                part.width -= d;
            }
            newparts.push(part);
        }
        newitem.parts = newparts;
        newitem.initialize();
        newitems.push(newitem);
    }
    
    if (isDecimal(newt)) {
        // todo
        console.log("Chunk Overflow -- X");
    }
    
    if (item.parts) {
        var newparts = new Array();
        for (var i = 0; i < item.parts.length; i++) {
            var part = item.parts[i];
            if (part.x > chunksize.width) continue;
            if (part.x + part.width > chunksize.width) {
                var d = part.x + part.width - chunksize.width;
                part.width -= d;
            }
            newparts.push(part);
        }
        item.parts = newparts;
    }
    item.initialize();
    return newitems;
}

WorldBuilderChunk.prototype.chunkItemY = function(item, chunksize, newitems) { 

    var newt = item.height / chunksize.height;
    for (var i = 1; i < newt; i++) {
        var newitem = item.clone();
        
        if (!newitem || !newitem.parts) continue;
        
        newitem.y = item.y + chunksize.height * i;
        
        var newparts = new Array();
        for (var ii = 0; ii < newitem.parts.length; ii++) {
            var part = newitem.parts[ii];
            if (part.y > chunksize.height * (i + 1)) continue;
            if (part.y + part.height < chunksize.height) continue;
            if (part.y + part.height > chunksize.height) {
                var d = part.y + part.height - chunksize.height;
                part.height -= d;
            }
            newparts.push(part);
        }
        newitem.parts = newparts;
        newitem.initialize();
        newitems.push(newitem);
    }
    
    if (isDecimal(newt)) {
        // todo
        console.log("Chunk Overflow -- Y");
    }
    
    var newparts = new Array();
    for (var i = 0; i < item.parts.length; i++) {
        var part = item.parts[i];
        if (part.y > chunksize.height) continue;
        if (part.y + part.height > chunksize.height) {
            var d = part.y + part.height - chunksize.height;
            part.height -= d;
        }
        newparts.push(part);
    }
    item.parts = newparts;
    item.initialize();
    return newitems;
}

WorldBuilderChunk.prototype.chunkItemZ = function(item, chunksize, newitems) { 
    var newt = item.depth / chunksize.depth;
    item.depth = chunksize.depth;
    for (var i = 1; i < newt; i++) {
        var newitem = item.clone();
        
        if (!newitem) continue;
        
        newitem.z = item.z + chunksize.depth * i;
        newitem.initialize();
        newitems.push(newitem);
    }
    item.initialize();
    if (isDecimal(newt)) {
        // todo
        console.log("Chunk Overflow -- Z");
    }
    return newitems;
}
