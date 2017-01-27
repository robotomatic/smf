"use strict";

function MenuMain(gamecontroller) {
    
    this.gamecontroller = gamecontroller;
    
    this.input = this.gamecontroller.input;
    this.input.setMenu(this);
    
    var settings = this.gamecontroller.gamesettings.getSettings(this.gamecontroller.currentview)
    
    this.loop = new GameLoop(this.input);

    this.charspacex = 45;
    this.charspacey = 200;

    this.level = this.gamecontroller.gameloader.level;
    this.characters = this.gamecontroller.gameloader.characters;
    this.charnames = Object.keys(this.characters.characters);
    this.animations = this.gamecontroller.gameloader.animations.animations;

    this.players = null;
    
    this.view = null;
    this.started = false;

    this.width = 1200;
    this.height = 800;
    this.scale = 1;
    
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
    this.addCharacters();
//    var c = this;
//    setTimeout(function() {
//        c.addCharacters();
//    }, 3000);
}

MenuMain.prototype.loadLevel = function() { this.loop.loadLevel(this.level); }

MenuMain.prototype.loadCharacters = function() { for (var charname in this.characters.characters) this.loadCharacter(charname); }

MenuMain.prototype.loadCharacter = function(charname) {
    var chars = this.characters.characters;
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
    var chars = this.characters.characters;
    var charnames = this.charnames;
    
    this.players = new Players();
    
    var playertotal = charnames.length;
    
    var def = 1;
    var numplayers = (playertotal > def) ? playertotal : def;
    //numplayers = 4;
    
    var currentchar = 0;
    for (var i = 0; i < numplayers; i++) {

        var character = null;
        if (currentchar < playertotal) character = chars[charnames[currentchar]];
        else character = chars[charnames[random(0, playertotal - 1)]];
        
//        character = chars[charnames[5]];
        
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
    this.loop.loadPlayers(this.players);
}

MenuMain.prototype.loadPlayer = function(id, x, y, character) {

    var char = new Character().loadJson(character.json);
    char = this.loadCharacterAnimations(char);

//    var pw;
//    var ph;
    var speed = 2;
    
//    var r = false;
//    if (r) {
//        var r = random(100, 255);
//        var g = random(100, 255);
//        var b = random(100, 255);
//        
//        var color;        
//        var rc = random(0, 2);
//        if (rc == 0) color = rgbToHex(r, 0, 0);
//        else if (rc == 1) color = rgbToHex(0, g, 0);
//        else color = rgbToHex(0, 0, b);
//        char.color = color;
//        
////        var ch = character.height;
////        ph = random(ch - 10, ch);
////        var cw = character.width;
////        pw = random(cw - 15, cw);
//        
//        speed = random(speed - 1, speed + 1);    
//    }

    var pw = character.width * 2;
    var ph = character.height * 2;
    
    var pdiff = (20 - pw) / 2;
    
    var player = new Player(id, character.name, "", x, y, pw, ph, speed, char);
    player.jumpspeed = 10;
    player.ready = true;
    player.lookThreshold = .1;
    return player;
}

MenuMain.prototype.loadView = function() {
    var menubox = {
        "x" : 0,
        "y" : this.level.height - 50,
        "width" : this.level.width,
        "height" : 100
    }
    this.loop.hideViews();
    var w = this.height;
    var h = this.width;
    var s = this.scale;
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
}

MenuMain.prototype.startGame = function() {
    var b = document.getElementById("start-game");
    window.location = b.href;
}


