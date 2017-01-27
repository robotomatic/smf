"use strict";

function GameSettings() {
    this.settings = {};
}

GameSettings.prototype.getSettings = function(name) {
    if (!this.settings) this.settings = {};
    if (!this.settings[name]) this.settings[name] = {};
    return this.settings[name];
}

GameSettings.prototype.setSettings = function(name, settings) {
    this.settings[name] = settings;
}

GameSettings.prototype.load = function() {
    this.settings = JSON.parse(localStorage.getItem("super.murder.friends.settings"));
}

GameSettings.prototype.save = function() {
    localStorage.setItem("super.murder.friends.settings", JSON.stringify(this.settings));
}