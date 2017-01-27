function Menu(devtools) {
    this.running = false;
    this.busy = false;
    this.devtools = devtools;
    this.showLogo(); 
}

Menu.prototype.load = function() {}
Menu.prototype.start = function() { 
    fadeInSlow(document.getElementById("main-logo"));
    this.running = true; 
}
Menu.prototype.stop = function() { this.running = false; }
Menu.prototype.resize = function() { 
    this.positionButtons(); 
    this.devtools.resize();
}

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

Menu.prototype.positionButtons = function() {
    var prev = document.getElementsByClassName("menu-game-player-view-player-button-prev");
    if (prev.length) positionElements(prev);
    var next = document.getElementsByClassName("menu-game-player-view-player-button-next");
    if (next.length) positionElements(next);
}

