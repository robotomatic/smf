"use strict";

function StageBuilderChunk() {
    this.dochunk = true;
    this.granularity = {
        x : 300,
        y : 300,
        z : 300
    }
}

StageBuilderChunk.prototype.chunk = function(stage) { 
    if (!this.dochunk) return;
    for (var i = 0; i < stage.items.length; i++) {
        var item = stage.items[i];
        if (item.draw === false) continue;
        if (item.width == "100%" || item.height == "100%" || item.depth == "100%") continue;
        this.chunkItem(stage, item);
    }
}

StageBuilderChunk.prototype.chunkItem = function(stage, item) { 
    if (item.width > this.granularity.x) this.chunkItemX(stage, item);
    if (item.height > this.granularity.y) this.chunkItemY(stage, item);
    if (item.depth > this.granularity.z) this.chunkItemZ(stage, item);
}

StageBuilderChunk.prototype.chunkItemX = function(stage, item) { 

    var newt = item.width / this.granularity.x;
    for (var i = 1; i < newt; i++) {
        var newitem = item.clone();
        
        if (!newitem || !newitem.parts) continue;
        
        newitem.x = item.x + this.granularity.x * i;
        
        var newparts = new Array();
        for (var ii = 0; ii < newitem.parts.length; ii++) {
            var part = newitem.parts[ii];
            if (part.x > this.granularity.x * (i + 1)) continue;
            if (part.x + part.width < this.granularity.x) continue;
            if (part.x + part.width > this.granularity.x) {
                var d = part.x + part.width - this.granularity.x;
                part.width -= d;
            }
            newparts.push(part);
        }
        newitem.parts = newparts;
        newitem.initialize();
        stage.items.push(newitem);
    }
    
    if (isDecimal(newt)) {
        console.log("Deccca -- X");
        // todo
    }
    
    if (item.parts) {
        var newparts = new Array();
        for (var i = 0; i < item.parts.length; i++) {
            var part = item.parts[i];
            if (part.x > this.granularity.x) continue;
            if (part.x + part.width > this.granularity.x) {
                var d = part.x + part.width - this.granularity.x;
                part.width -= d;
            }
            newparts.push(part);
        }
        item.parts = newparts;
    }
    item.initialize();
}

StageBuilderChunk.prototype.chunkItemY = function(stage, item) { 

    var newt = item.height / this.granularity.y;
    for (var i = 1; i < newt; i++) {
        var newitem = item.clone();
        
        if (!newitem || !newitem.parts) continue;
        
        newitem.y = item.y + this.granularity.y * i;
        
        var newparts = new Array();
        for (var ii = 0; ii < newitem.parts.length; ii++) {
            var part = newitem.parts[ii];
            if (part.y > this.granularity.y * (i + 1)) continue;
            if (part.y + part.height < this.granularity.y) continue;
            if (part.y + part.height > this.granularity.y) {
                var d = part.y + part.height - this.granularity.y;
                part.height -= d;
            }
            newparts.push(part);
        }
        newitem.parts = newparts;
        newitem.initialize();
        stage.items.push(newitem);
    }
    
    if (isDecimal(newt)) {
        console.log("Deccca -- X");
        // todo
    }
    
    var newparts = new Array();
    for (var i = 0; i < item.parts.length; i++) {
        var part = item.parts[i];
        if (part.y > this.granularity.y) continue;
        if (part.y + part.height > this.granularity.y) {
            var d = part.y + part.height - this.granularity.y;
            part.height -= d;
        }
        newparts.push(part);
    }
    item.parts = newparts;
    item.initialize();
}

StageBuilderChunk.prototype.chunkItemZ = function(stage, item) { 
    var newt = item.depth / this.granularity.z;
    item.depth = this.granularity.z;
    for (var i = 1; i < newt; i++) {
        var newitem = item.clone();
        
        if (!newitem) continue;
        
        newitem.z = item.z + this.granularity.z * i;
        newitem.initialize();
        stage.items.push(newitem);
    }
    item.initialize();
    if (isDecimal(newt)) {
        console.log("Deccca -- Z");
        // todo
    }
}
