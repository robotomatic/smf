"use strict";

function initializeDevFPS() {
    createDevFPSType("tick");
    createDevFPSType("update");
    createDevFPSType("render");
}

function createDevFPSType(type) {
    if (!devfps) devfps = document.getElementById("dev-fps");
    if (!devfps) return;
    devfpstype[type] = [];
    var d = document.createElement("div");
    d.className = "dev-row-fps";
    var pn = document.createElement("p");
    pn.className = "dev-fps-row-fps text-left";
    pn.innerHTML = type;
    d.appendChild(pn);
    var p = document.createElement("p");
    p.className = "dev-fps-row-fps text-right";
    var pid = "dev-fps-" + type;
    var paid = "dev-fps-" + type + "-average";
    p.id = pid;
    d.appendChild(p);
    var pa = document.createElement("p");
    pa.className = "dev-fps-row-fps text-right";
    pa.id = paid;
    d.appendChild(pa);
    devfps.appendChild(d);
    devfpstype[type]["fps"] = document.getElementById(p.id);
    devfpstype[type]["fps-average"] = document.getElementById(pa.id);
}

function logDevFPS(type, fps, aps) {

    if (!devfps) devfps = document.getElementById("dev-fps");
    if (!devfps) return;
    var pid = "dev-fps-" + type;
    var paid = "dev-fps-" + type + "-average";
    
    if (elapsed[type] == undefined) elapsed[type] = 0;
    
    elapsed[type] += 1;
    if (elapsed[type] < delay) return;
    elapsed[type] = 0;
    
    var f = document.getElementById(pid);
    if (f) f.innerHTML = Math.round(fps * 1000) / 1000;
    var a = document.getElementById(paid);
    if (a) a.innerHTML = Math.round(aps * 1000) / 1000;
    
    if (type == "tick") {
        if (!fpsmain) fpsmain = document.getElementById("dev-toolbar-fps");
        if (fpsmain) fpsmain.innerHTML = (Math.round(fps * 1000) / 1000) + " FPS";
    }
}
