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
    this.npcs = null;
    this.view = null;
    this.started = false;
    
    this.numplayers = 0;
    
    this.width = 100;
    this.height = 100;
    this.fov = 10;
    this.scale = 0;
    this.levelquality = 1;
    this.playerquality = 1;
    this.device = "";
    this.gamequality = new GameQuality(this, 2);
    
    this.load();
    return this;
}

MenuMain.prototype.loadSettings = function() {}
    
MenuMain.prototype.getSettings = function() {}

MenuMain.prototype.load = function() {
    this.loadLevel();
    this.loadCharacters();
    this.loadView();
    this.addCharacters();
}

MenuMain.prototype.loadLevel = function() { 
    this.loop.loadLevel(this.level);
    this.level.buildColliders();
}

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
    this.npcs = new NPCs();
    var playertotal = charnames.length;
    if (this.numplayers === 0) this.numplayers = playertotal;
    var currentchar = 0;
    
//    var mychar = "yeti";
    
    var rando = random(0, playertotal - 1);
    
    for (var i = 0; i < this.numplayers; i++) {
        var character = null;
        
        if (currentchar < playertotal) character = chars[charnames[currentchar]];
        else character = chars[charnames[random(0, playertotal - 1)]];
        
//        character = chars[charnames[rando]];
//        character = chars[mychar];
        
        var playerx;
        var found = false;
        var loops = 0;
        var maxloops = 100;
        while (!found) {
            var testx = random(100, this.level.width - 100);
            if (this.players.players.length == 0) {
                found = true;
                playerx = testx;
            } else {
                var ok = true;
                for (var ii = 0; ii < this.players.players.length; ii++) {
                    var d = Math.abs(this.players.players[ii].controller.x - testx);
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
        var playerz = 0;
        var player = this.loadPlayer(i, playerx, playery, playerz, character);
        this.players.addPlayer(player);
        var npc = new NPC(player);
        this.npcs.addNPC(npc);
        currentchar = (currentchar < playertotal - 1) ? currentchar + 1 : 0;
    }
    this.players.sortByHeight();
    this.loop.loadPlayers(this.players);
    this.loop.loadNPCs(this.npcs);
}

MenuMain.prototype.loadPlayer = function(id, x, y, z, character) {
    var char = new Character().loadJson(character.json);
    char = this.loadCharacterAnimations(char);
    var speed = 2;
    var pw = character.width * 2;
    var ph = character.height * 2;
    var pdiff = (20 - pw) / 2;
    var player = new Player(id, character.name, "", x, y, z, pw, ph, speed, char);
    player.controller.jumpspeed = 5;
    player.info.ready = true;
    player.controller.lookThreshold = .1;
    return player;
}

MenuMain.prototype.loadView = function() {
    this.loop.hideViews();
    this.view = new MenuView("menu-canvas", this.width, this.height, this.scale, this.levelquality, this.playerquality);
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