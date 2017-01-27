GameController = function(element) {
    this.element = document.getElementById(element);
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
        if (!controller.ignorefade) fadeOut(controller.element);
        controller.ignorefade = false;
        var hash = window.location.hash.replace(/#/g,'');
        loadAjax("views/"+hash+".html", function(data) {
            
            //  todo: this can be smarter and cleaner
            
            if (hash.indexOf("game-player") > -1) controller.showGamePlayer(data);
            else if (hash.indexOf("player-level") > -1) controller.showMenuPlayerLevel(data);
            else if (hash.indexOf("player-customize") > -1) controller.showMenuPlayerCustomize(data);
            else if (hash.indexOf("player")> -1) controller.showMenuPlayer(data);
            else controller.showMenu(data);
        });
    } else {
        if (!controller.ignorefade) fadeOut(controller.element);
        controller.ignorefade = false;
        loadAjax("views/menu.html", function(data) {
            controller.showMenu(data);
        });
    }
}

GameController.prototype.showMenu = function(data) {
    this.stop();
    this.loadUI(data);
    this.game = new Menu();
    resize();
    this.start();
    fadeIn(this.element);
    this.ignorefade = false;
}

GameController.prototype.showMenuPlayer = function(data) {
    this.stop();
    this.loadUI(data);
    var controller = this;
    this.gameloader.loadMenuPlayer(
        "dat/menu.json",
        "dat/characters.json", 
        "dat/animations.json",
        function() {
            controller.game = new MenuPlayer(controller.gameloader);
            resize();
            controller.start();
            fadeIn(controller.element);
            controller.ignorefade = false;
        }
    );
}

GameController.prototype.showMenuPlayerCustomize = function(data) {
    this.stop();
    this.loadUI(data);
    this.game = new MenuPlayerLevel();
    resize();
    fadeIn(this.element);
    this.ignorefade = false;
}

GameController.prototype.showMenuPlayerLevel = function(data) {
    this.stop();
    this.loadUI(data);
    this.game = new MenuPlayerLevel();
    resize();
    fadeIn(this.element);
    this.ignorefade = false;
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
        function() {
            controller.game = new GamePlayer(controller.gameloader);
            resize();
            controller.start();
            fadeIn(controller.element);
            controller.ignorefade = false;
        }
    );
}

GameController.prototype.loadUI = function(data) {
    this.element.innerHTML = data;
}

GameController.prototype.start = function() {
    if (this.game) this.game.start();
}

GameController.prototype.resize = function() {
    if (this.game) this.game.resize();
}

GameController.prototype.stop = function() {
    if (this.game) this.game.stop();
}

