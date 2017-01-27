function GameController() {
    this.maincontent = document.getElementById("main-content");
    this.button1 = document.getElementById("main-content-button-1");
    this.button2 = document.getElementById("main-content-button-2");
    this.button3 = document.getElementById("main-content-button-3");
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
    return this;
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
                var p = document.getElementById("main-content");
                controller.game = new MenuPlayerChooser(controller.gameloader, p, 4, controller.devtools);
                controller.start();
            }
        );
    });
}

GameController.prototype.showMenuLevelChooser = function(data) {
    this.stop();
    var controller = this;
    this.loadUI(data, function() {
        controller.game = new MenuPlayerLevel(controller.gameloader, controller.devtools);
        controller.start();
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
    if (buttons.length) {
        if (buttons.length == 1) controller.button2.innerHTML = buttons[0].innerHTML;
        else {
            controller.button1.innerHTML = buttons[0].innerHTML;
            controller.button2.innerHTML = buttons[1].innerHTML;
            if (buttons[2]) controller.button3.innerHTML = buttons[2].innerHTML;
        }
    }
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
    fadeIn(this.button1.childNodes[1]);
    fadeIn(this.button2.childNodes[1]);
    fadeIn(this.button3.childNodes[1]);
}

GameController.prototype.fadeOut = function() {
    for (var i = 0; i < this.maincontent.childNodes.length; i++) fadeOutHide(this.maincontent.childNodes[i]);
    fadeOutHide(this.button1.childNodes[1]);
    fadeOutHide(this.button2.childNodes[1]);
    fadeOutHide(this.button3.childNodes[1]);
}