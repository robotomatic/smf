"use strict";

function GameController() {
    this.input = new Input();
    this.main = document.getElementById("main");
    this.maincontent = document.getElementById("main-content");
    this.ignorefade = true;
    this.gameloader = new GameLoader();
    this.game = null;
    this.paused = false;
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
    this.devtools = null;
    this.loadDev();
    this.loadGameSettings();
    return this;
}


GameController.prototype.dev = function() {
    var d = document.getElementById("dev");
    if (!d) return;
    if (!__dev) {
        __dev = true;
        this.initDebug();
    } else {
        __dev = false;
        hide(d);
    }
}


GameController.prototype.loadDev = function(callback) {
    if (!__dev) return;
    if (this.devtools) return;
    var controller = this;
    this.gameloader.loadDev("html/dev.html", function() {
        controller.devtools = controller.gameloader.dev;
        controller.main.innerHTML += controller.devtools;
        if (callback) callback();
        benchmark("load dev tools");
    });
}

GameController.prototype.loadGameSettings = function() {
    this.gamesettings = new GameSettings();
    this.gamesettings.load();
    benchmark("load settings");
}

GameController.prototype.saveGameSettings = function() {
    this.gamesettings.setSettings(this.currentview, this.game.getSettings());
    this.gamesettings.save();
}

GameController.prototype.loadView = function() {
    if (this.game && this.gamesettings) this.saveGameSettings();
    this.game = null;
    var controller = this;
    if (window.location.hash) {
        if (!controller.ignorefade) this.fadeOut(controller.element);
        controller.ignorefade = false;
        var hash = window.location.hash.replace(/#/g,'');
        loadAJAX("html/"+hash+".html", function(data) {
            controller.showView(hash, data);
            benchmark("load view");
        });
    } else {
        if (!controller.ignorefade) this.fadeOut(controller.element);
        controller.ignorefade = false;
        loadAJAX("html/menu.html", function(data) {
            controller.showMenu(data);
            benchmark("load menu");
        });
    }
}

GameController.prototype.showView = function(view, data) {
    if (view.indexOf("game") > -1) this.showGameParty(data);
    else this.showMenu(data);
}

GameController.prototype.showMenu = function(data) {
    this.stop();
    var controller = this;
    this.loadUI(data);
    controller.gameloader.loadMenu(
        "dat/menus/main_menu.json",
        "dat/characters.json", 
        "dat/animations.json",
        function() {
            controller.currentview = "menu";
            controller.game = new GameControllerMenuMain(controller);
            controller.start();
        }
    );
}

GameController.prototype.showGameParty = function(data) {
    this.stop();
    var controller = this;
    this.loadUI(data);
    controller.gameloader.loadGameParty(
        "dat/levels.json",
        "dat/themes.json",
        "dat/materials.json",
        "dat/characters.json", 
        "dat/animations.json",
        function() {
            controller.currentview = "game";
            var gamesettings = controller.gamesettings.getSettings("game-party");
            var levelsettings = controller.gamesettings.getSettings("menu-level-chooser");
            var playersettings = controller.gamesettings.getSettings("menu-player-chooser");
            controller.game = new GameControllerGame(controller, gamesettings, levelsettings, playersettings);
            controller.game.load(function() {
                controller.game.loadPlayers();
                controller.game.loadViews();
                controller.start();
            });
        }
    );
}

GameController.prototype.loadUI = function(data) {
    var content = document.getElementById("main-content");
    content.innerHTML = "";
    content.innerHTML = data;
    this.resize();
}
    
GameController.prototype.start = function() {
    this.resize();
    this.initDebug();
    this.game.start();
    this.fadeIn();
    this.ignorefade = false;
    benchmark("start game");
    logDev("");
}


GameController.prototype.initDebug = function() {
    if (!__dev) return;
    if (!dev_init) initializeDev(this);
    resetDev(this);
    show(document.getElementById("dev"));
}

GameController.prototype.resize = function() {
    if (!this.game) return;
    this.game.resize();
    if (__dev) resizeDev();
}

GameController.prototype.run = function(now) {
    if (!this.game) return;
    if (this.game.loop) this.game.run(now);
}

GameController.prototype.reset = function() {
    if (!this.game) return;
    this.game.reset();
}

GameController.prototype.pause = function(now) {
    if (this.paused) return;
    if (!this.game) return;
    if (this.game.loop) this.game.pause(now);
    logDev("");
    logDev("Pause : " + round(now));
    logDev("");
    this.paused = true;
}

GameController.prototype.resume = function(now) {
    if (!this.paused) return;
    if (!this.game) return;
    logDev("");
    logDev("Resume : " + round(now));
    logDev("");
    if (this.game.loop) this.game.resume(now);
    this.paused = false;
}


GameController.prototype.addPlayer = function(charname) {
    if (!this.game) return;
    this.game.addPlayer(charname);
}

GameController.prototype.removePlayer = function(player) {
    if (!this.game) return;
    this.game.removePlayer(player);
}

GameController.prototype.changePlayerCharacter = function(player, charname) {
    if (!this.game) return;
    this.game.changePlayerCharacter(player, charname);
}


GameController.prototype.stop = function() {
    if (!this.game) return;
    this.game.stop();
}

GameController.prototype.fadeIn = function() {
    fadeIn(this.maincontent);
}

GameController.prototype.fadeOut = function() {
    fadeOut(this.maincontent);
}