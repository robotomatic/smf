var devlog = null;
var devfps = null;
var devfpstype = [];
var elapsed = 0;
var delay = 10;

function toggleDev() {
    var dw = document.getElementById("dev-wrap");
    var h = dw.offsetHeight;
    if (h) {
        dw.style.height = 0;
        dw.style.padding = 0;
    } else {
        dw.style.height = "auto";
        dw.style.padding = "1em";
    }
}

function toggleBlur() {
    var blurs = document.getElementsByClassName("graphics-b");
    var t = blurs.length;
    for (var i = 0; i < t; i++) {
        var cn = blurs[i].className;
        if (cn.indexOf("blur-blur") > -1) {
            cn = cn.replace("blur-blur", "blur");
            blurs[i].className = cn;
        } else if (cn.indexOf("blur") > -1) {
            cn = cn.replace("blur", "blur-blur");
            blurs[i].className = cn;
        }
    }
}




function logDev(message) {
    if (!devlog) {
        devlog = document.getElementById("dev-log");
        document.getElementById("dev-toolbar-toggle").onclick = function() {
            toggleDev();
        }
        document.getElementById("dev-toolbar-toggle-blur").onclick = function() {
            toggleBlur();
        }
    }
    if (!devlog) return;
    devlog.innerHTML += message + "<br />";
}






function logDevFPS(type, fps, aps) {

    if (!devfps) devfps = document.getElementById("dev-fps");
    if (!devfps) return;

    var pid = "dev-fps-" + type;
    var paid = "dev-fps-" + type + "-average";
    
    if (!devfpstype[type]) {
        devfpstype[type] = [];
        var d = document.createElement("div");
        d.className = "dev-fps-row";
        var pn = document.createElement("p");
        pn.className = "dev-fps-row-fps text-left";
        pn.innerHTML = type;
        d.appendChild(pn);
        var p = document.createElement("p");
        p.className = "dev-fps-row-fps text-right";
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

    elapsed += 1;
    if (elapsed < delay) return;
    elapsed = 0;
    
    var f = document.getElementById(pid);
    if (f) f.innerHTML = Math.round(fps * 1000) / 1000;
    var a = document.getElementById(paid);
    if (a) a.innerHTML = Math.round(aps * 1000) / 1000;
}