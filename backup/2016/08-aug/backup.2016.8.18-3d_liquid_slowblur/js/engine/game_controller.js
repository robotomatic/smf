"use strict";

function GameController() {
    this.input = new Input();
    this.maincontent = document.getElementById("main-content");
    this.gamepad = document.getElementById("gamepads");
    this.ignorefade = true;
    this.gameloader = new GameLoader();
    this.game = null;
    var controller = this;
    window.onbeforeunload = function (e) { 
        if (controller.game && controller.gamesettings) controller.saveGameSettings();
        fadeOut(controller.maincontent); 
    };    
    window.onpopstate=function() {
        if (!controller.ignorepop) controller.loadView();
        controller.ignorepop = false;
    };
    this.currentview = "menu";
    this.gamesettings = null;
    this.loadGameSettings();
    return this;
}

GameController.prototype.loadGameSettings = function() {
    this.gamesettings = new GameSettings();
    this.gamesettings.load();
}

GameController.prototype.saveGameSettings = function() {
    this.gamesettings.setSettings(this.currentview, this.game.getSettings());
    this.gamesettings.save();
}

GameController.prototype.loadView = function() {
    if (this.game && this.gamesettings) this.saveGameSettings();
    var controller = this;
    if (window.location.hash) {
        if (!controller.ignorefade) this.fadeOut(controller.element);
        controller.ignorefade = false;
        var hash = window.location.hash.replace(/#/g,'');
        loadAJAX("html/"+hash+".html", function(data) {
            controller.showView(hash, data);
        });
    } else {
        if (!controller.ignorefade) this.fadeOut(controller.element);
        controller.ignorefade = false;
        loadAJAX("html/menu.html", function(data) {
            controller.showMenu(data);
        });
    }
}

GameController.prototype.showView = function(view, data) {
    //  todo: this can be smarter and cleaner
    if (view.indexOf("party") > -1) this.showMenuPlayerChooser(data);
    else if (view.indexOf("game") > -1) this.showGameParty(data);
    else if (view.indexOf("level") > -1) this.showMenuLevelChooser(data);
    else if (view.indexOf("player")> -1) this.showMenuPlayerChooser(data);
    else this.showMenu(data);
}

GameController.prototype.showMenu = function(data) {
    this.stop();
    var controller = this;
    this.loadUI(data, function() {
        controller.gameloader.loadMenu(
            "dat/menus/main_menu.json",
            "dat/characters.json", 
            "dat/animations.json",
            function() {
                var p = document.getElementById("menu-player-wrap");
                controller.currentview = "menu";
                
                controller.game = new MenuMain(controller);
                controller.start();
            }
        );
    });
}

GameController.prototype.showMenuPlayerChooser = function(data) {
    this.stop();
    var controller = this;
    this.loadUI(data, function() {
        controller.gameloader.loadMenuPlayerChooser(
            "dat/menus/player_menu.json",
            "dat/characters.json", 
            "dat/animations.json",
            "html/ui-player-chooser.html",
            function() {
                var p = document.getElementById("menu-player-wrap");
                controller.currentview = "menu-player-chooser";
                
                controller.game = new MenuPlayerChooser(controller, p);
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
            "dat/themes.json",
            "html/ui-level-chooser.html",
            function() {
                var p = document.getElementById("menu-level-wrap");
                controller.currentview = "menu-level-chooser";
                
                controller.game = new MenuLevelChooser(controller, p);
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
            "dat/levels.json",
            "dat/themes.json",
            "dat/characters.json", 
            "dat/animations.json",
            function() {
                controller.currentview = "game-party";
                var gamesettings = controller.gamesettings.getSettings("game-party");
                var levelsettings = controller.gamesettings.getSettings("menu-level-chooser");
                var playersettings = controller.gamesettings.getSettings("menu-player-chooser");
                
                controller.game = new GameParty(controller, gamesettings, levelsettings, playersettings);
                controller.start();
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
    var controller = this;
    if (main.length) {
        controller.maincontent.innerHTML = "";
        controller.maincontent.innerHTML = main[0].innerHTML;
    }
    this.resize();
    if (callback) callback();
}
    
GameController.prototype.start = function() {
    this.resize();
    if (this.game) {
        if (!Array.isArray(this.game)) { this.game.start(); }
        else { for (var i = 0; i < this.game.length; i++) this.game[i].start(); }
    }
    this.fadeIn();
    this.ignorefade = false;
}

GameController.prototype.resize = function() {
    if (!this.game) return;
    if (!Array.isArray(this.game)) { this.game.resize(); }
    else { for (var i = 0; i < this.game.length; i++) this.game[i].resize(); }
}

GameController.prototype.run = function(now) {
    if (!this.game) return;
    if (!Array.isArray(this.game)) { if (this.game.loop) this.game.loop.run(now); }
    else { for (var i = 0; i < this.game.length; i++) this.game[i].loop.run(now); }
}

GameController.prototype.render = function(now) {
    if (!this.game) return;
    if (!Array.isArray(this.game)) { if (this.game.loop) this.game.loop.render(now); }
    else { for (var i = 0; i < this.game.length; i++) this.game[i].loop.render(now); }
}

GameController.prototype.stop = function() {
    if (!this.game) return;
    if (!Array.isArray(this.game)) { this.game.stop(); }
    else { for (var i = 0; i < this.game.length; i++) this.game[i].stop(); }
}

GameController.prototype.fadeIn = function() {
    fadeIn(this.maincontent);
}

GameController.prototype.fadeOut = function() {
    fadeOut(this.maincontent);
}