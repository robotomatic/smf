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

function sortByKeyNumber(a, b){
    return Number(a) < Number(b) ? -1 : 1;
}

function sortByKeyNumberReverse(a, b){
    return Number(b) < Number(a) ? -1 : 1;
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


function sortByBoxY(a, b){
    
    var ay = a.y;
    var by = b.y;
    
    if ( ay < by ) return 1;
    if ( ay > by ) return -1;
    return 0;
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


function sortByZY(a, b){
    if ( a.z < b.z ) return 1;
    if ( a.z > b.z ) return -1;
    return a.y - b.y;
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


function sortByZX(a, b){
    return b.z - a.z || a.x - b.x;
}

function sortByReverseZX(a, b){
    return b.z - a.z || b.x - a.x;
}


function sortByYZ(a, b){
    return a.y - b.y || b.z - a.z;
}

function sortByReverseYZ(a, b){
    return b.y - a.y || b.z - a.z;
}

function sortByYZDepth(a, b){
    return a.y - b.y || (b.z + b.depth) - (a.z + a.depth);
}

function sortByReverseYZDepth(a, b){
    return b.y - a.y || (b.z + b.depth) - (a.z + a.depth);
}






function sortByItemZDepth(a, b){
    
    var az = a.mbr.z + a.mbr.depth;
    var bz = b.mbr.z + b.mbr.depth;
    
    if ( az < bz ) return 1;
    if ( az > bz ) return -1;
    return 0;
}

function sortByItemZ(a, b){
    
    var az = a.mbr.z;
    var bz = b.mbr.z;
    
    if ( az < bz ) return 1;
    if ( az > bz ) return -1;
    return 0;
}







function sortByXZ(a, b) {
    
    var ax = a.x;
    var az = a.z;
    var bx = b.x;
    var bz = b.z;
    
    
}

function sortByXWZ(a, b) {

    var ax = a.x + a.width;
    var az = a.z;
    var bx = b.x;
    var bz = b.z;
    
}