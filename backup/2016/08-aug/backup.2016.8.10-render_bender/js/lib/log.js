var lastused = 0;

function dumpMemory() {
    var u = window.performance.memory.usedJSHeapSize;      
    var ud = u - lastused;
    var o = ud;
    var gc = ud < 0;
    if (gc) {
        o += " <================================================================================= GC";
        console.timeStamp("Garbage Collect --> " + ud);
    }
    lastused = u;
    if (gc) log(ud + " <======== GC!", "gc");
    log("----------------------", "memory");
    log("Used:  " + u, "memory");
    log("Delta:  " + o, "memory");
}

function log(message, what) {

    if (what == "new") return;
    if (what == "memory") return;
    if (what == "gc") return;
    if (what == "fps") return;
    
    console.log(message);
}
