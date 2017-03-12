"use strict";

var dev_log = null;

function logDev(message) {
    if (!dev_log) dev_log = document.getElementById("dev-log");
    if (!dev_log) return;
    if (!message) message = "--------------------------------";
    dev_log.innerHTML += message + "<br />";
}