"use strict";

function GameControllerMenu(gamecontroller) {
    this.gamecontroller = gamecontroller;
    this.input = this.gamecontroller.input;
    this.input.setMenu(this);
    
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
    this.gamequality = new GameQuality(this, 2);

    this.load();
    return this;
}

GameControllerMenu.prototype.load = function() {
    benchmark("build menu - start", "menu");
    this.loadLevel();
    this.loadCharacters();
    this.loadView();
    this.addCharacters();
    benchmark("build menu - end", "menu");
}

GameControllerMenu.prototype.loadLevel = function() { 
    this.loop.loadLevel(this.level);
}



GameControllerMenu.prototype.loadCharacters = function() { 
    for (var charname in this.characters.characters) this.loadCharacter(charname); 
}

GameControllerMenu.prototype.loadCharacter = function(charname) {
    var chars = this.characters.characters;
    var character = chars[charname];
    this.loadCharacterAnimations(character);
}
    
GameControllerMenu.prototype.loadCharacterAnimations = function(character) {
    var charanims = new Array();
    for (var a in character.animations) charanims[character.animations[a]] = this.animations[character.animations[a]];
    character.setAnimator(new CharacterAnimator(charanims));
    character.setRenderer(new CharacterRenderer());
    return character;
}
    
GameControllerMenu.prototype.addCharacters = function() {
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
    this.loop.loadPlayers(this.players);
    this.loop.loadNPCs(this.npcs);
}

GameControllerMenu.prototype.addPlayer = function(charname) {
    
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

GameControllerMenu.prototype.loadPlayer = function(id, x, y, z, character) {
    var char = new Character().loadJson(character.json);
    char = this.loadCharacterAnimations(char);
    var speed = 1;
    var pw = character.width;
    var ph = character.height;
    var pdiff = (20 - pw) / 2;
    var name = "Player-" + id;
    var player = new Player(id, name, "", x, y, z, pw, ph, speed, char, 100, this);
    player.controller.jumpspeed = 5;
    player.info.ready = true;
    player.info.alive = true;
    player.controller.lookThreshold = .1;
    return player;
}


GameControllerMenu.prototype.changePlayerCharacter = function(player, charname) {
    var character = this.gamecontroller.gameloader.characters.characters[charname];
    if (!character) {
        logDev("Change Player Character - No such Character named " + charname);
        return;
    }
    var char = new Character().loadJson(character.json);
    char = this.loadCharacterAnimations(char);
    player.setCharacter(character);
}

GameControllerMenu.prototype.updatePlayerCamera = function(player, camera) {
    player.getscamera = camera;
    var follow = false;
    var t = this.players.players.length;
    for (var i = 0; i < t; i++) {
        if (this.players.players[i].getscamera) {
            follow = true;
            break;
        }
    }
    this.gamecontroller.gamesettings.settings.camera.follow = follow;
    this.gamecontroller.saveGameSettings();
}



GameControllerMenu.prototype.loadView = function() {
    this.loop.hideViews();
    this.view = new View(this, "menu-canvas", this.gamequality, this.onclick);
    this.view.renderer.camerasettings.setCameraZoom("fit");
    this.loop.loadViews(new Array(this.view));
    if (!this.running && this.started) {
        this.resize();
        this.start();
    }
    fadeIn(document.getElementById("menu-canvas-canvas"));    
}

GameControllerMenu.prototype.resetViews = function() {
    this.loop.gameworld.resetViews();
}



GameControllerMenu.prototype.onclick = function(e) {
    if (controller.paused) return;
    if (e.target.id != "gamecanvas") return;
    window.location.hash="#game";
}

GameControllerMenu.prototype.start = function() {
    this.loop.start();
    this.loop.showViews();
    this.running = true;
    this.startPlayers();
}

GameControllerMenu.prototype.startPlayers = function() {
    for (var i = 0; i < this.players.players.length; i++) {
        this.loop.gameworld.world.worldcollider.resetPlayer(this.players.players[i], 1);
    }
}


GameControllerMenu.prototype.reset = function() {
    this.loop.reset(timestamp());
}

GameControllerMenu.prototype.run = function(when, paused) {
    this.loop.run(when, paused);
}

GameControllerMenu.prototype.pause = function(when) {
    this.loop.pause(when);
}

GameControllerMenu.prototype.resume = function(when) {
    this.loop.resume(when);
}

GameControllerMenu.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

GameControllerMenu.prototype.resize = function() {
    this.loop.resize();
}

GameControllerMenu.prototype.startGame = function() {
    var b = document.getElementById("start-game");
    window.location = b.href;
}

GameControllerMenu.prototype.removePlayer = function(player) {
    this.loop.removePlayer(player);
    this.players.removePlayer(player);
    this.npcs.removeNPC(player);
}

GameControllerMenu.prototype.playerDied = function(player) {
    this.loop.gameworld.world.worldcollider.resetPlayer(player);
}

GameControllerMenu.prototype.changeWorldTheme = function(theme, active) {
}

