"use strict";

function logDev(message) {
    
    if (!__dev) return;
    
    if (!devlog) devlog = document.getElementById("dev-log");
    if (!devlog) return;
    if (!message) message = "--------------------------------";
    devlog.innerHTML += message + "<br />";
}