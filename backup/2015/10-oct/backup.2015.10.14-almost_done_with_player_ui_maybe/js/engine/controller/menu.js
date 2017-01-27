function Menu(devtools, settings) {
    this.running = false;
    this.busy = false;
    this.devtools = devtools;
    this.settings = settings;
    this.showLogo(); 
}

Menu.prototype.getSettings = function() { return null; }

Menu.prototype.load = function() {}
Menu.prototype.start = function() { 
    var button = document.getElementById("main-content-game-button");
    button.className = button.className.replace(/button-disabled/g, '');
    if (button.className.indexOf("bg-color-ok") == -1) button.className += " bg-color-ok";
    fadeInSlow(document.getElementById("main-logo"));
    this.running = true; 
}
Menu.prototype.stop = function() { this.running = false; }
Menu.prototype.resize = function() { this.devtools.resize(); }

Menu.prototype.showLogo = function() {
    var words = document.getElementsByClassName("logo-words");
    for (var i = 0; i < words.length; i++) this.showLogoWord(words[i]);
}

Menu.prototype.showLogoWord = function(elem) {
    var html = elem.innerHTML;
    var newhtml = "";
    for (var i = 0; i < html.length; i++) newhtml+="<span class='logo-words-letters logo-words-letters-wobble '>" + html[i] + "</span>";
    elem.innerHTML = newhtml;
}