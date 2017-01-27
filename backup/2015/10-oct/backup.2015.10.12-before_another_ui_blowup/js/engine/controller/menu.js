// letter rotation is wonky when returning here
// remove header & footer button color & trim & set fg color to white  when in game mode?


function Menu(devtools) {
    this.running = false;
    this.busy = false;
    this.devtools = devtools;
    this.showLogo(); 
}

Menu.prototype.load = function() {}
Menu.prototype.start = function() { this.running = true; }
Menu.prototype.stop = function() { this.running = false; }
Menu.prototype.resize = function() { 
    this.positionButtons(); 
    this.devtools.resize();
}

Menu.prototype.showLogo = function() {
    var words = document.getElementsByClassName("logo-words");
    for (var i = 0; i < words.length; i++) this.showLogoWord(words[i]);
    this.wiggleLetters(); 
}

Menu.prototype.showLogoWord = function(elem) {
    var html = elem.innerHTML;
    var newhtml = "";
    for (var i = 0; i < html.length; i++) newhtml+="<span class='logo-words-letters logo-words-letters-rotate '>" + html[i] + "</span>";
    elem.innerHTML = newhtml;
}

Menu.prototype.wiggleLetters = function(elem) {
    var letters = document.getElementsByClassName("logo-words-letters-rotate");
    for (var i = 0; i < letters.length; i++) {
        var letter = letters[i];
        var classes = letter.className;
        var newclass = "";
        if (classes.indexOf("logo-words-letters-rotate-bwd") > -1) newclass = " logo-words-letters-rotate-fwd";
        else newclass = " logo-words-letters-rotate-bwd";
        letter.className = letter.className.replace(/logo-words-letters-rotate-bwd/g, '');
        letter.className = letter.className.replace(/logo-words-letters-rotate-fwd/g, '');
        letter.className += newclass;
    }
    var timeout = 700;
    var menu = this;
    setTimeout(function() { menu.wiggleLetters(); }, timeout);
}
    

Menu.prototype.positionButtons = function() {
    var prev = document.getElementsByClassName("menu-game-player-view-player-button-prev");
    if (prev.length) positionElements(prev);
    var next = document.getElementsByClassName("menu-game-player-view-player-button-next");
    if (next.length) positionElements(next);
}

