function MenuMain(gamecontroller) {
    
    this.gamecontroller = gamecontroller;
    
    this.input = this.gamecontroller.input;
    this.input.setMenu(this);
    
    this.devtools = this.gamecontroller.devtools;
    
    var settings = this.gamecontroller.gamesettings.getSettings(this.gamecontroller.currentview)
    
    this.menu = new Menu(this.devtools, settings);
    this.loop = new GameLoop(this.input, this.devtools);

    this.charspacex = 45;
    this.charspacey = 200;

    this.level = this.gamecontroller.gameloader.level;
    this.characters = this.gamecontroller.gameloader.characters;
    this.charnames = Object.keys(this.characters);
    this.animations = this.gamecontroller.gameloader.animations;

    this.players = null;
    
    this.view = null;
    this.started = false;

    this.load();
    return this;
}

MenuMain.prototype.menu;

MenuMain.prototype.loadSettings = function() {}
    
MenuMain.prototype.getSettings = function() {}

MenuMain.prototype.load = function() {
    this.loadLevel();
    this.loadCharacters();
    this.loadView();
    var c = this;
    setTimeout(function() {
        c.addCharacters();
    }, 3000);
}

MenuMain.prototype.loadLevel = function() { this.loop.loadLevel(this.level); }

MenuMain.prototype.loadCharacters = function() { for (var charname in this.characters) this.loadCharacter(charname); }

MenuMain.prototype.loadCharacter = function(charname) {
    var chars = this.characters;
    var character = chars[charname];
    this.loadCharacterAnimations(character);
}
    
MenuMain.prototype.loadCharacterAnimations = function(character) {
    var charanims = new Array();
    for (var a in character.animations) charanims[character.animations[a]] = this.animations[character.animations[a]];
    character.setAnimator(new CharacterAnimator(charanims));
    character.setRenderer(new CharacterRenderer());
    return character;
}
    
MenuMain.prototype.addCharacters = function() {
    var chars = this.characters;
    var charnames = this.charnames;
    
    this.players = new Players();
    
    playertotal = charnames.length;
    
    var def = 10;
    var numplayers = (playertotal > def) ? playertotal : def;
    
    var currentchar = 0;
    for (var i = 0; i < numplayers; i++) {

        var character = null;
        if (currentchar < playertotal) character = chars[charnames[currentchar]];
        else character = chars[charnames[random(0, playertotal - 1)]];
        
        var playerx;
        var found = false;
        var loops = 0;
        var maxloops = 100;
        while (!found) {
            var testx = random(20, this.level.width - 20);
            if (this.players.players.length == 0) {
                found = true;
                playerx = testx;
            } else {
                var ok = true;
                for (var ii = 0; ii < this.players.players.length; ii++) {
                    var d = Math.abs(this.players.players[ii].x - testx);
                    if (d < 20) {
                        ok = false;
                        break;
                    }
                }
                if (ok) {
                    found = true;
                    playerx = testx;
                }
            }
            loops++;
            if (loops > maxloops) {
                found = true;
                playerx = testx;
            }
        }
        
        var playery = 10; 
        var player = this.loadPlayer(i, playerx, playery, character);
        this.players.addPlayer(player);
        
        currentchar = (currentchar < playertotal - 1) ? currentchar + 1 : 0;
    }
    this.players.sortByHeight();
    this.loop.loadPlayers(this.players.getPlayers());
}

MenuMain.prototype.loadPlayer = function(id, x, y, character) {
    var pw = character.width ? character.width : 20;
    var ph = character.height ? character.height : 25;
    var pdiff = (20 - pw) / 2;
    pdiff = 0;
    var char = new Character().loadJson(character.json);
    char = this.loadCharacterAnimations(char);
    var speed = 1;
    var player = new Player(id, character.name, "", x + pdiff, y, pw, ph, speed, char);
    player.jumpspeed = 2.5;
    player.ready = true;
    player.lookThreshold = .1;
    return player;
}

MenuMain.prototype.loadView = function() {
    var menubox = {
        "x" : 0,
        "y" : this.level.height - 50,
        "width" : this.level.width,
        "height" : 300
    }
    this.loop.hideViews();
    var w = 1400;
    var h = 690;
    var s = 2;
    this.view = new MenuView("menu-canvas", w, h, s);
    this.loop.loadViews(new Array(this.view));
    
    if (!this.running && this.started) {
        this.resize();
        this.start();
    }
    fadeIn(document.getElementById("menu-canvas-canvas"));    
}


MenuMain.prototype.start = function() {
    this.loop.start();
    this.loop.showViews();
    this.running = true;
}

MenuMain.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

MenuMain.prototype.resize = function() {
    this.loop.resize();
    this.menu.resize();
}

MenuMain.prototype.startGame = function() {
    var b = document.getElementById("start-game");
    window.location = b.href;
}


