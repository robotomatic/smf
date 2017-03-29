"use strict";

function GameControllerMenuMain(gamecontroller) {
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
    this.device = "";
    this.gamequality = new GameQuality(this, 2);

    this.load();
    return this;
}

GameControllerMenuMain.prototype.loadSettings = function() {}
    
GameControllerMenuMain.prototype.getSettings = function() {}

GameControllerMenuMain.prototype.load = function() {
    benchmark("build menu - start", "menu");
    this.loadLevel();
    this.loadCharacters();
    this.loadView();
    this.addCharacters();
    benchmark("build menu - end", "menu");
}

GameControllerMenuMain.prototype.loadLevel = function() { 
    this.loop.loadLevel(this.level);
}

GameControllerMenuMain.prototype.loadCharacters = function() { 
    for (var charname in this.characters.characters) this.loadCharacter(charname); 
}

GameControllerMenuMain.prototype.loadCharacter = function(charname) {
    var chars = this.characters.characters;
    var character = chars[charname];
    this.loadCharacterAnimations(character);
}
    
GameControllerMenuMain.prototype.loadCharacterAnimations = function(character) {
    var charanims = new Array();
    for (var a in character.animations) charanims[character.animations[a]] = this.animations[character.animations[a]];
    character.setAnimator(new CharacterAnimator(charanims));
    character.setRenderer(new CharacterRenderer());
    return character;
}
    
GameControllerMenuMain.prototype.addCharacters = function() {
    var chars = this.characters.characters;
    var charnames = this.charnames;
    this.players = new Players();
    this.npcs = new NPCs();
    var playertotal = charnames.length;
    if (this.numplayers === 0) this.numplayers = playertotal;
    var currentchar = 0;
    
    if (isMobile()) this.numplayers = 1;
    var mychar = "psycho";
    
    var rando = random(0, playertotal - 1);
    
    for (var i = 0; i < this.numplayers; i++) {
        var charname = (currentchar < playertotal) ? charnames[currentchar] : charnames[random(0, playertotal - 1)];
        this.addPlayer(charname);
        currentchar = (currentchar < playertotal - 1) ? currentchar + 1 : 0;
    }
    this.players.sortByHeight();
    this.loop.loadPlayers(this.players);
    this.loop.loadNPCs(this.npcs);
}

GameControllerMenuMain.prototype.addPlayer = function(charname) {
    
    var character = this.gamecontroller.gameloader.characters.characters[charname];
    if (!character) {
        logDev("Unable to Add Character: No character named " + charname);
        return;
    }
    
    var playerx = 0;
    var playery = 0; 
    var playerz = 0;

    var player = this.loadPlayer(this.players.players.length, playerx, playery, playerz, character);

    this.players.addPlayer(player);
    var npc = new NPC(player);
    this.npcs.addNPC(npc);
    
    updateDevPlayers(this.players.players);
}

GameControllerMenuMain.prototype.loadPlayer = function(id, x, y, z, character) {
    var char = new Character().loadJson(character.json);
    char = this.loadCharacterAnimations(char);
    var speed = 1;
    var pw = character.width;
    var ph = character.height;
    var pdiff = (20 - pw) / 2;
    var player = new Player(id, character.name, "", x, y, z, pw, ph, speed, char);
    player.controller.jumpspeed = 5;
    player.info.ready = true;
    player.info.alive = true;
    player.getscamera = true;
    player.controller.lookThreshold = .1;
    return player;
}


GameControllerMenuMain.prototype.changePlayerCharacter = function(player, charname) {
    var character = this.gamecontroller.gameloader.characters.characters[charname];
    if (!character) {
        logDev("Change Player Character - No such Character named " + charname);
        return;
    }
    var char = new Character().loadJson(character.json);
    char = this.loadCharacterAnimations(char);
    player.setCharacter(character);
}


GameControllerMenuMain.prototype.loadView = function() {
    this.loop.hideViews();
    this.view = new MenuView(this.gamecontroller, "menu-canvas", this.width, this.height, this.scale);
    this.loop.loadViews(new Array(this.view));
    if (!this.running && this.started) {
        this.resize();
        this.start();
    }
    fadeIn(document.getElementById("menu-canvas-canvas"));    
}

GameControllerMenuMain.prototype.start = function() {
    this.loop.start();
    this.loop.showViews();
    this.running = true;
    this.startPlayers();
}

GameControllerMenuMain.prototype.startPlayers = function() {
    for (var i = 0; i < this.players.players.length; i++) {
        this.loop.game.world.worldcollider.resetPlayer(this.players.players[i], 1);
    }
}


GameControllerMenuMain.prototype.reset = function() {
    this.loop.reset(timestamp());
}

GameControllerMenuMain.prototype.run = function(when) {
    this.loop.run(when);
}

GameControllerMenuMain.prototype.pause = function(when) {
    this.loop.pause(when);
}

GameControllerMenuMain.prototype.resume = function(when) {
    this.loop.resume(when);
}

GameControllerMenuMain.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

GameControllerMenuMain.prototype.resize = function() {
    this.loop.resize();
}

GameControllerMenuMain.prototype.startGame = function() {
    var b = document.getElementById("start-game");
    window.location = b.href;
}

GameControllerMenuMain.prototype.removePlayer = function(player) {
    this.loop.removePlayer(player);
    this.players.removePlayer(player);
    this.npcs.removeNPC(player);
}

