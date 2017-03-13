"use strict";

var dev_log = null;

function logDev(message) {
    if (!dev_log) dev_log = document.getElementById("dev-log");
    if (!dev_log) return;
    if (!message) message = "--------------------------------";
    dev_log.innerHTML += message + "<br />";
}

function logDevError(error) {
    if (!dev_log) dev_log = document.getElementById("dev-log");
    if (!dev_log) return;
    var message = "";
    if (!error) {
        message = "--------------------------------";
    } else {
        var err = new Error();
        message = err.stack;
    }
    dev_log.innerHTML += message + "<br />";
}