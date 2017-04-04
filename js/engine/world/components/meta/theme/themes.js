"use strict";

function Themes() {
    this.themes = new Array();
}

Themes.prototype.addTheme = function(theme) {
    this.themes.push(theme);
}

Themes.prototype.getTheme = function(index) {
    return this.themes[index];
}

Themes.prototype.getThemeByName = function(name) {
    var out  = null;
    for (var i = 0; i < this.themes.length; i++) {
        var theme = this.themes[i];
        if (theme.name == name) {
            out = theme;
            break;
        }
    }
    return out;
}