"use strict";

function logDev(message) {
    if (!devlog) devlog = document.getElementById("dev-log");
    if (!devlog) return;
    if (!message) message = "--------------------------------";
    devlog.innerHTML += message + "<br />";
}