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
