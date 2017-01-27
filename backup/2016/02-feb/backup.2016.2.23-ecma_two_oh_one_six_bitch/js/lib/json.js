"use strict";

function loadJSON(path, success, error) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) success(JSON.parse(xhr.responseText));
            } else {
                if (error) error(xhr);
            }
        }
    };
    xhr.open("GET", path + "?nocache=" + Date.now(), true);
    xhr.send();
}

function getJSON(path, key, val, success, error) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) success(JSON.parse(xhr.responseText));
            } else {
                if (error) error(xhr);
            }
        }
    };
    xhr.open("GET", path + "?" + key + "=" + val, true);
    xhr.send();
}

function postJSON(path, key, data, success, error) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) success(xhr.responseText ? JSON.parse(xhr.responseText) : null);
            } else {
                if (error) error(xhr);
            }
        }
    };
    xhr.open("POST", path);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send(key + "=" + JSON.stringify(data));
}