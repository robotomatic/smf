function sortObject(obj, func) {
    var sortable = [];
    for (var o in obj) sortable.push([o, obj[o]])
    sortable.sort(sortById);
    var out = {};
    for (var s in sortable) {
        var sort = sortable[s];
        out[sort[0]] = sort[1];
    }
    return out;
}

function sortById(a, b){
    return a[1].id < b[1].id ? -1 : 1;
}

function sortByX(a, b){
    return a.x - b.x;
}

function sortByXReverse(a, b){
    return b.x - a.x;
}


function sortByY(a, b){
    return a.y - b.y;
}

function sortByYReverse(a, b){
    return b.y - a.y;
}


function sortByPositionX(a, b){
    if (a.x == b.x) return a.y - b.y;
    return a.x - b.x;
}

function sortByPositionY(a, b){
    if (a.y == b.y) return a.x - b.x;
    return a.y - b.y;
}

function sortByZIndex(a, b){
    if ( a.zindex < b.zindex ) return -1;
    if ( a.zindex > b.zindex ) return 1;
    return 0;
}

function sortByZ(a, b){
    
    var az = a.z;
    var bz = b.z;
    
    if ( az < bz ) return 1;
    if ( az > bz ) return -1;
    return 0;
}

function sortByZDepth(a, b){
    
    var az = a.z + a.depth;
    var bz = b.z + b.depth;
    
    if ( az < bz ) return 1;
    if ( az > bz ) return -1;
    return 0;
}

function sortByHeight(a, b){
    var ah = a.controller.y + a.controller.height;
    var bh = b.controller.y + b.controller.height;
    if (ah == bh) {
        // both on ground. use height
        if ( a.controller.height > b.controller.height ) return -1;
        if ( a.controller.height < b.controller.height ) return 1;
        return 0;
    } else {
        // elevation difference
        if (!a.controller.grounded) {
            // jumping or falling. use height
            if ( a.controller.height > b.controller.height ) return -1;
            if ( a.controller.height < b.controller.height ) return 1;
            return 0;
        } else {
            // standing on something reverse order
            if ( ah < bh ) return -1;
            return 1;
        }
    }
}
