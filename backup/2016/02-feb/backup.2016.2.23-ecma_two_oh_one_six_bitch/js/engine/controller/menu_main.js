"use strict";

function MenuMain(gamecontroller) {
    
    this.gamecontroller = gamecontroller;
    
    this.input = this.gamecontroller.input;
    this.input.setMenu(this);
    
    this.devtools = this.gamecontroller.devtools;
    
    let settings = this.gamecontroller.gamesettings.getSettings(this.gamecontroller.currentview)
    
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
    let c = this;
    setTimeout(function() {
        c.addCharacters();
    }, 3000);
}

MenuMain.prototype.loadLevel = function() { this.loop.loadLevel(this.level); }

MenuMain.prototype.loadCharacters = function() { for (let charname in this.characters) this.loadCharacter(charname); }

MenuMain.prototype.loadCharacter = function(charname) {
    let chars = this.characters;
    let character = chars[charname];
    this.loadCharacterAnimations(character);
}
    
MenuMain.prototype.loadCharacterAnimations = function(character) {
    let charanims = new Array();
    for (let a in character.animations) charanims[character.animations[a]] = this.animations[character.animations[a]];
    character.setAnimator(new CharacterAnimator(charanims));
    character.setRenderer(new CharacterRenderer());
    return character;
}
    
MenuMain.prototype.addCharacters = function() {
    let chars = this.characters;
    let charnames = this.charnames;
    
    this.players = new Players();
    
    let playertotal = charnames.length;
    
    let def = 1;
    let numplayers = (playertotal > def) ? playertotal : def;
//    numplayers = 2;
    
    let currentchar = 0;
    for (let i = 0; i < numplayers; i++) {

        let character = null;
        if (currentchar < playertotal) character = chars[charnames[currentchar]];
        else character = chars[charnames[random(0, playertotal - 1)]];
        
//        character = chars[charnames[5]];
        
        let playerx;
        let found = false;
        let loops = 0;
        let maxloops = 100;
        while (!found) {
            let testx = random(20, this.level.width - 20);
            if (this.players.players.length == 0) {
                found = true;
                playerx = testx;
            } else {
                let ok = true;
                for (let ii = 0; ii < this.players.players.length; ii++) {
                    let d = Math.abs(this.players.players[ii].x - testx);
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
        
        let playery = 10; 
        let player = this.loadPlayer(i, playerx, playery, character);
        this.players.addPlayer(player);
        
        currentchar = (currentchar < playertotal - 1) ? currentchar + 1 : 0;
    }
    this.players.sortByHeight();
    this.loop.loadPlayers(this.players.getPlayers());
}

MenuMain.prototype.loadPlayer = function(id, x, y, character) {

    let char = new Character().loadJson(character.json);
    char = this.loadCharacterAnimations(char);

//    let pw;
//    let ph;
    let speed = 2;
    let jumpspeed = 3.5;
    
    let r = false;
    if (r) {
        let r = random(100, 255);
        let g = random(100, 255);
        let b = random(100, 255);
        
        let color;        
        let rc = random(0, 2);
        if (rc == 0) color = rgbToHex(r, 0, 0);
        else if (rc == 1) color = rgbToHex(0, g, 0);
        else color = rgbToHex(0, 0, b);
        char.color = color;
        
//        let ch = character.height;
//        ph = random(ch - 10, ch);
//        let cw = character.width;
//        pw = random(cw - 15, cw);
        
        speed = random(speed - 1, speed + 1);    
        jumpspeed = random(jumpspeed - 1, jumpspeed + 1);    
    }

    let pw = character.width * 2;
    let ph = character.height * 2;
    
    let pdiff = (20 - pw) / 2;
    
    let player = new Player(id, character.name, "", x, y, pw, ph, speed, char);
    player.jumpspeed = jumpspeed;
    player.ready = true;
    player.lookThreshold = .1;
    return player;
}

MenuMain.prototype.loadView = function() {
    let menubox = {
        "x" : 0,
        "y" : this.level.height - 50,
        "width" : this.level.width,
        "height" : 100
    }
    this.loop.hideViews();
    let w = 600;
    let h = 250;
    let s = 2;
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
    let b = document.getElementById("start-game");
    window.location = b.href;
}


