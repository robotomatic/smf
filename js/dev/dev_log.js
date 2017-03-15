"use strict";

var dev_log = null;
var messages = new Array();

function logDev(message) {
    
    console.log(message);
    
    if (!dev_log) dev_log = document.getElementById("dev-log");
    if (!dev_log) {
        messages.push(message);
        return;
    }
    if (messages.length) {
        for (var i = 0; i < messages.length; i++) {
            logDevMessage(messages[i]);
        }
        messages.length = 0;
    }
    logDevMessage(message);
}

function logDevMessage(message) {
    if (!message) message = "--------------------------------";
    dev_log.innerHTML += message + "<br />";
}