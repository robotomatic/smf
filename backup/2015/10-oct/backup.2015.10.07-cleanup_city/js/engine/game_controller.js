function GameController() {
    this.element = document.getElementById("main");
    this.ignorepop = false;
    this.ignorefade = true;
    this.gameloader = new GameLoader();
    this.game = null;
    var controller = this;
    window.onpopstate=function() {
        if (!controller.ignorepop) controller.loadView();
        controller.ignorepop = false;
    };
    return this;
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
    this.loadUI(data);
    var controller = this;
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
    this.game = new Menu();
    this.start();
}

GameController.prototype.showMenuPlayerChooser = function(data) {
    this.stop();
    this.loadUI(data);
    var controller = this;
    this.gameloader.loadMenuPlayerChooser(
        "dat/menu.json",
        "dat/characters.json", 
        "dat/animations.json",
        "views/ui-player-chooser.html",
        "views/ui-dev.html",
        function() {
            var p = document.getElementById("main-content");
            controller.game = new MenuPlayerChooser(controller.gameloader, p, 4);
            controller.start();
        }
    );
}

GameController.prototype.showMenuLevelChooser = function(data) {
    this.stop();
    this.loadUI(data);
    this.game = new MenuPlayerLevel();
    this.start();
}

GameController.prototype.showGamePlayer = function(data) {
    this.stop();
    this.loadUI(data);
    var controller = this;
    this.gameloader.loadGamePlayer(
        "dat/levels/level1.json",
        "dat/items.json",
        "dat/players.json", 
        "dat/characters.json", 
        "dat/animations.json",
        "views/ui-dev.html",
        function() {
            controller.game = new GamePlayer(controller.gameloader);
            controller.start();
        }
    );
}

GameController.prototype.showGameParty = function(data) {
    this.stop();
    this.loadUI(data);
    var controller = this;
    this.gameloader.loadGameParty(
        "dat/levels/level1.json",
        "dat/items.json",
        "dat/players.json", 
        "dat/characters.json", 
        "dat/animations.json",
        "views/ui-dev.html",
        function() {
            controller.game = new GameParty(controller.gameloader);
            controller.start();
        }
    );
}

GameController.prototype.loadUI = function(data) {
    this.element.innerHTML = data;
    resize();
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
    fadeIn(this.element);
    var e = document.getElementById("game-content");
    fadeIn(e);
}

GameController.prototype.fadeOut = function() {
    fadeOut(this.element);
}