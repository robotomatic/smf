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

function sortByHeight(a, b){
    
    var ah = a.y + a.height;
    var bh = b.y + b.height;
    
    if (ah == bh) {
        // both on ground. use height
        if ( a.height > b.height ) return -1;
        if ( a.height < b.height ) return 1;
        return 0;
    } else {
        // elevation difference
        if (!a.grounded) {
            // jumping or falling. use height
            if ( a.height > b.height ) return -1;
            if ( a.height < b.height ) return 1;
            return 0;
        } else {
            // standing on something reverse order
            if ( ah < bh ) return -1;
            return 1;
        }
    }
}
