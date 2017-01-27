function GameController() {
    this.buttonsettings;
    this.buttonhome;
    this.buttonfullscreen;
    this.buttonvolume;
    this.loadButtons();
    this.maincontent = document.getElementById("main-content");
    this.button = document.getElementById("main-content-game-button");
    this.ignorepop = false;
    this.ignorefade = true;
    this.gameloader = new GameLoader();
    this.devtools;
    this.loadDevTools();
    this.game = null;
    var controller = this;
    window.onpopstate=function() {
        if (!controller.ignorepop) controller.loadView();
        controller.ignorepop = false;
    };
    this.uicantimeout = true;
    this.uitimeout = 3000;
    this.uitimer = null;
    this.uishowing = false;
    this.mousex = 0; 
    this.mousey = 0;
    window.onmousemove = function(e) { 
        if(e.clientX == controller.mousex && e.clientY == controller.mousey) return;
        controller.mousex = e.clientX;
        controller.mousey = e.clientY;    
        controller.showui(); 
    };
    this.showui();
    return this;
}

GameController.prototype.showui = function() {
    if (this.uishowing) return;
    document.getElementById("main").style.cursor = "default";
    showSlide(document.getElementById("main-content-head"));
    showSlide(document.getElementById("main-content-foot"));
    this.uishowing = true;
    
    if (this.uitimer) clearTimeout(this.uitimer);
    if (!this.uicantimeout) return;
    
    var controller = this;
    this.uitimer = setTimeout(function() {
        document.getElementById("main").style.cursor = "none";
        hideSlide(document.getElementById("main-content-head"));
        hideSlide(document.getElementById("main-content-foot"));
        controller.uishowing = false;
    }, controller.uitimeout);
}

GameController.prototype.loadButtons = function() {
    this.buttonsettings = document.getElementById("main-content-button-settings");
    this.buttonsettings.onclick = function(e) {
        e.preventDefault();
        return false;
    }
    this.buttonhome = document.getElementById("main-content-button-home");
    this.buttonfullscreen = document.getElementById("main-content-button-fullscreen");
    this.buttonfullscreen.onclick = function(e) {
        if (this.className.indexOf("fullscreen") > -1) this.className = this.className.replace(/fullscreen/g, '');
        else this.className += " fullscreen";
        toggleFullScreen();
        e.preventDefault();
        return false;
    }
    this.buttonvolume = document.getElementById("main-content-button-volume");
    this.buttonvolume.onclick = function(e) {
        e.preventDefault();
        return false;
    }
}


GameController.prototype.loadDevTools = function() {
    var controller = this;
    this.gameloader.loadDevToolsFile(
        "views/ui-dev.html",
        function() {
            controller.devtools = new DevTools(controller.gameloader.devtools);
        }
    );
}

GameController.prototype.loadView = function() {
    if (this.uitimer) clearTimeout(this.uitimer);
    this.uicantimeout = false;
    this.uishowing = false;
    this.showui();
    var controller = this;
    if (window.location.hash) {
        if (!controller.ignorefade) this.fadeOut(controller.element);
        controller.ignorefade = false;
        var hash = window.location.hash.replace(/#/g,'');
        loadAJAX("views/"+hash+".html", function(data) {
            controller.showView(hash, data);
        });
    } else {
        if (!controller.ignorefade) this.fadeOut(controller.element);
        controller.ignorefade = false;
        loadAJAX("views/menu.html", function(data) {
            controller.showMenu(data);
        });
    }
}

GameController.prototype.showView = function(view, data) {
    //  todo: this can be smarter and cleaner
    if (view.indexOf("party") > -1) this.showMenuPlayerChooser(data);
    else if (view.indexOf("game-party") > -1) this.showGameParty(data);
    else if (view.indexOf("game") > -1) this.showGamePlayer(data);
    else if (view.indexOf("level") > -1) this.showMenuLevelChooser(data);
    else if (view.indexOf("player")> -1) this.showMenuPlayerChooser(data);
    else this.showMenu(data);
}

GameController.prototype.showMenu = function(data) {
    this.stop();
    this.uicantimeout = true;
    this.uishowing = false;
    this.showui();
    var controller = this;
    this.loadUI(data, function() {
        var buttons = document.getElementsByClassName('loader');
        for (var i = 0; i < buttons.length; i++){
            buttons[i].onclick = function(e){ 
                controller.fadeOut();
                controller.ignorepop = true;
                var href = buttons[i].getAttribute("href");
                loadAjax("views/" + href + ".html", function(data) {
                    window.location.hash = href;
                    controller.showView(href, data);
                });
                e.preventDefault();
                return false;
            };
        }    
        controller.game = new Menu(controller.devtools);
        controller.start();
    });
}

GameController.prototype.showMenuPlayerChooser = function(data) {
    this.stop();
    var controller = this;
    this.loadUI(data, function() {
        controller.gameloader.loadMenuPlayerChooser(
            "dat/menu.json",
            "dat/characters.json", 
            "dat/animations.json",
            "views/ui-player-chooser.html",
            function() {
                var p = document.getElementById("menu-player-wrap");
                controller.game = new MenuPlayerChooser(controller.gameloader, p, 4, controller.devtools);
                controller.uicantimeout = false;
                controller.uishowing = false;
                controller.showui();
                controller.start();
            }
        );
    });
}

GameController.prototype.showMenuLevelChooser = function(data) {
    this.stop();
    var controller = this;
    this.loadUI(data, function() {
        controller.gameloader.loadMenuLevelChooser(
            "dat/levels.json",
            "dat/items.json",
            "views/ui-level-chooser.html",
            function() {
                var p = document.getElementById("menu-level-wrap");
                controller.game = new MenuLevelChooser(controller.gameloader, p, controller.devtools);
                controller.uicantimeout = false;
                controller.uishowing = false;
                controller.showui();
                controller.start();
            }
        );
    });
}

GameController.prototype.showGamePlayer = function(data) {
    this.stop();
    var controller = this;
    this.loadUI(data, function() {
        controller.gameloader.loadGamePlayer(
            "dat/levels/level1.json",
            "dat/items.json",
            "dat/players.json", 
            "dat/characters.json", 
            "dat/animations.json",
            function() {
                controller.game = new GamePlayer(controller.gameloader, controller.devtools);
                controller.uicantimeout = true;
                controller.uishowing = false;
                controller.showui();
                controller.start();
            }
        );
    });
}

GameController.prototype.showGameParty = function(data) {
    this.stop();
    var controller = this;
    this.loadUI(data, function() {
        controller.gameloader.loadGameParty(
            "dat/levels/level1.json",
            "dat/items.json",
            "dat/players.json", 
            "dat/characters.json", 
            "dat/animations.json",
            function() {
                controller.game = new GameParty(controller.gameloader, controller.devtools);
                controller.start();
            }
        );
    });
}

GameController.prototype.loadUI = function(data, callback) {
    this.fadeOut();
    var controller = this;
    setTimeout(function() { controller.swapUI(data, callback); }, 1000);
}

GameController.prototype.swapUI = function(data, callback) {
    var div = document.createElement("div");
    div.innerHTML = data;
    var main = div.getElementsByClassName("main-content-wrap");
    if (main.length) {
        controller.maincontent.innerHTML = "";
        controller.maincontent.innerHTML = main[0].innerHTML;
    }
    var buttons = div.getElementsByClassName("button-wrap");
    if (buttons.length) controller.button.innerHTML = buttons[0].innerHTML;
    resize();
    if (callback) callback();
}
    
GameController.prototype.start = function() {
    resize();
    if (this.game) {
        if (!Array.isArray(this.game)) { this.game.start(); }
        else { for (var i = 0; i < this.game.length; i++) this.game[i].start(); }
    }
    this.fadeIn();
    this.ignorefade = false;
}

GameController.prototype.resize = function() {
    if (this.game) {
        if (!Array.isArray(this.game)) { this.game.resize(); }
        else { for (var i = 0; i < this.game.length; i++) this.game[i].resize(); }
    }
}

GameController.prototype.run = function() {
    if (this.game) {
        if (!Array.isArray(this.game)) { if (this.game.loop) this.game.loop.run(); }
        else { for (var i = 0; i < this.game.length; i++) this.game[i].loop.run(); }
    }
}

GameController.prototype.stop = function() {
    if (this.game) {
        if (!Array.isArray(this.game)) { this.game.stop(); }
        else { for (var i = 0; i < this.game.length; i++) this.game[i].stop(); }
    }
}

GameController.prototype.fadeIn = function() {
    for (var i = 0; i < this.maincontent.childNodes.length; i++) fadeIn(this.maincontent.childNodes[i]);
    var buttons = document.getElementsByClassName("menu-game-button-icon-link");
    for (var i = 0; i < buttons.length; i++) fadeIn(buttons[i]);
}

GameController.prototype.fadeOut = function() {
    for (var i = 0; i < this.maincontent.childNodes.length; i++) fadeOutHide(this.maincontent.childNodes[i]);
    var buttons = document.getElementsByClassName("menu-game-button-icon-link");
    for (var i = 0; i < buttons.length; i++) fadeOutHide(buttons[i]);
}