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
        controller.showUI(); 
    };
    this.showMenuUI();
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

GameController.prototype.showMenuUI = function() {
    var head = document.getElementById("main-content-head");
    head.className = head.className.replace(/game-ui/g, '');
    var foot = document.getElementById("main-content-foot");
    foot.className = foot.className.replace(/game-ui/g, '');
    foot.className += " fade-border";
    var buttons = document.getElementsByClassName("menu-game-button-icon");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].className = buttons[i].className.replace(/game-ui shadow/g, '');
        buttons[i].className += " ui-shadow";
    }
    var icons = document.getElementsByClassName("menu-game-button-icon-link-icon");
    for (var i = 0; i < icons.length; i++) icons[i].className = icons[i].className.replace(/text-shadow/g, '');;
    var dev = document.getElementById("dev-ui");
    if (dev) {
        dev.className = dev.className.replace(/game-ui shadow/g, '');
        dev.className += " ui-shadow";
    }
    this.showUI();
}

GameController.prototype.showGameUI = function() {
    var head = document.getElementById("main-content-head");
    head.className += " game-ui";
    var foot = document.getElementById("main-content-foot");
    foot.className = foot.className.replace(/fade-border/g, '');
    foot.className += " game-ui";
    var buttons = document.getElementsByClassName("menu-game-button-icon");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].className = buttons[i].className.replace(/ui-shadow/g, '');
        buttons[i].className += " game-ui shadow";
    }
    var icons = document.getElementsByClassName("menu-game-button-icon-link-icon");
    for (var i = 0; i < icons.length; i++) icons[i].className += " text-shadow";
    var dev = document.getElementById("dev-ui");
    if (dev) {
        dev.className = dev.className.replace(/ui-shadow/g, '');
        dev.className += " game-ui shadow";
    }
    this.showUI();
}

GameController.prototype.showUI = function() {
    if (this.uishowing) return;
    document.getElementById("main").style.cursor = "default";
    showSlide(document.getElementById("main-content-head"));
    showSlide(document.getElementById("main-content-foot"));
    this.uishowing = true;
    
    if (this.uitimer) clearTimeout(this.uitimer);
    if (!this.uicantimeout) return;
    
    var controller = this;
    this.uitimer = setTimeout(function() {
        var h = window.innerHeight;
        if (controller.mousey > (h * .88)) {
            controller.uishowing = false;
            return;
        }
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
    if (this.game && this.gamesettings) this.saveGameSettings(this.game.getSettings());
    this.uicantimeout = false;
    this.uishowing = false;
    this.showUI();
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
    else if (view.indexOf("game") > -1) this.showGameParty(data);
    else if (view.indexOf("level") > -1) this.showMenuLevelChooser(data);
    else if (view.indexOf("player")> -1) this.showMenuPlayerChooser(data);
    else this.showMenu(data);
}

GameController.prototype.showMenu = function(data) {
    this.stop();
    this.uicantimeout = true;
    this.uishowing = false;
    this.showMenuUI();
    var controller = this;

    var button = document.getElementById("main-content-game-button");
    button.className = button.className.replace(/button-disabled/g, '');
    if (button.className.indexOf("bg-color-ok") == -1) button.className += " bg-color-ok";
    
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
        controller.currentview = "menu";
        controller.game = new Menu(controller.devtools, controller.gamesettings.getSettings(controller.currentview));
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
                controller.currentview = "menu-player-chooser";
                controller.game = new MenuPlayerChooser(controller.gameloader, p, 4, controller.devtools, controller.gamesettings.getSettings(controller.currentview));
                controller.uicantimeout = false;
                controller.uishowing = false;
                controller.showMenuUI();
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
                controller.currentview = "menu-level-chooser";
                controller.game = new MenuLevelChooser(controller.gameloader, p, controller.devtools, controller.gamesettings.getSettings(controller.currentview));
                controller.uicantimeout = false;
                controller.uishowing = false;
                controller.showMenuUI();
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
            "dat/characters.json", 
            "dat/animations.json",
            function() {
                controller.currentview = "game-party";
                var gamesettings = controller.gamesettings.getSettings("game-party");
                var playersettings = controller.gamesettings.getSettings("menu-player-chooser");
                var levelsettings = controller.gamesettings.getSettings("menu-level-chooser");
                var level = new Level();
                level = level.loadJson(levelsettings.level);
                level.setItemRenderer(controller.gameloader.items);
                var pcs = new Players();
                var charnames = Object.keys(controller.gameloader.characters);
                var players = playersettings.players;
                for (var i = 0; i < Object.keys(players).length; i++) {
                    var player = players[i];
                    if (!player.start || !player.ready) continue;
                    var character = controller.gameloader.characters[charnames[player.character]];
                    var charanims = new Array();
                    for (var a in character.animations) charanims[character.animations[a]] = controller.gameloader.animations[character.animations[a]];
                    character.setAnimator(new CharacterAnimator(charanims));
                    character.setRenderer(new CharacterRenderer());

                    var name = character.name;
                    var color = "red";
                    var x = 300 + (50 * i);
                    var y = 100;
                    var width = 20;
                    var height = 25;
                    var speed = 3.5;
                    
                    var pc = new Player(name, color, x, y, width, height, speed, character);
                    pcs.addPlayer(pc);
                }
                var gameinfo = { "level" : level, "players" : pcs };
                controller.game = new GameParty(gameinfo, controller.devtools, gamesettings);
                controller.start();
                controller.uicantimeout = true;
                controller.uishowing = false;
                controller.showGameUI();
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
    fadeIn(this.maincontent);
//    for (var i = 0; i < this.maincontent.childNodes.length; i++) fadeIn(this.maincontent.childNodes[i]);
    var buttons = document.getElementsByClassName("menu-game-button-icon-link");
    for (var i = 0; i < buttons.length; i++) fadeIn(buttons[i]);
}

GameController.prototype.fadeOut = function() {
    fadeOut(this.maincontent);
//    for (var i = 0; i < this.maincontent.childNodes.length; i++) fadeOutHide(this.maincontent.childNodes[i]);
//    var buttons = document.getElementsByClassName("menu-game-button-icon-link");
//    for (var i = 0; i < buttons.length; i++) fadeOut(buttons[i]);
}