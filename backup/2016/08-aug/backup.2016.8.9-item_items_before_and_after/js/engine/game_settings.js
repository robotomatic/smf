"use strict";

function GameSettings() {
    this.settings = {};
    this.key = "super.murder.friends.settings";
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
    this.settings = JSON.parse(localStorage.getItem(this.key));
}

GameSettings.prototype.save = function() {
    localStorage.setItem(this.key, JSON.stringify(this.settings));
}