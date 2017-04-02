"use strict";

function GameControllerGame(gamecontroller) {
    this.gamecontroller = gamecontroller;
    this.input = this.gamecontroller.input;
    this.loop = new GameLoop(this.input);
    this.gameloader = this.gamecontroller.gameloader;
    this.levelname = "";
    
    this.players = new Players();
    this.npcs = new NPCs();
    
    this.view = null;
    this.started = false;

    this.width = 100;
    this.height = 100;
    this.fov = 10;
    this.scale = 0;
    this.device = "";
    this.gamequality = new GameQuality(this, 1);
    
    this.hidegamepads = false;
    
    return this;
}

GameControllerGame.prototype.initGamepads = function() { 
    gamepads = document.getElementById("gamepads");
    if (!gamepads) return;
    if (isMobile() || isTablet()) show(gamepads);
    else hide(gamepads);
    if (__dev) updateDevViewOverlay();
}

GameControllerGame.prototype.hideGamepads = function() { 
    gamepads = document.getElementById("gamepads");
    if (!gamepads) return;
    if (isVisible(gamepads)) {
        this.hidegamepads = true;
        hide(gamepads);
    }
}

GameControllerGame.prototype.showGamepads = function() { 
    gamepads = document.getElementById("gamepads");
    if (!gamepads) return;
    if (this.hidegamepads) {
        this.hidegamepads = false;
        show(gamepads);
    }
}

GameControllerGame.prototype.load = function(callback) {
    var controller = this;
    var level = this.gameloader.levels[this.gamecontroller.gamesettings.settings.levelname];
    if (level) {
        this.levelname = this.gamecontroller.gamesettings.settings.levelname;
    } else {
        var k = Object.keys(this.gameloader.levels);
        var levelnum = 0;
        level = this.gameloader.levels[k[levelnum]];
        this.levelname = k[levelnum];
    }
    this.loadLevel(level, this.levelname, callback);
}

GameControllerGame.prototype.loadLevel = function(level, name, callback) {
    this.levelname = name;
    var controller = this;
    this.gameloader.loadLevelFile(level.file, function() {
        controller.loadLevelLevel(controller.gameloader.level, controller.levelname);
        if (callback) callback();
    });
}
    
GameControllerGame.prototype.loadLevelLevel = function(level, name, callback) {
    benchmark("load level: " + this.levelname);
    var themes = this.gameloader.levels[this.levelname].themes;
    if (themes) {
        var themkeys = Object.keys(themes);
        for (var i = 0; i < themkeys.length; i++) {
            var themename = themes[themkeys[i]];
            this.loop.loadTheme(themename, this.gameloader.themes.themes[themename], this.gameloader.materials);
        }
    }
    this.loop.loadLevel(level);
    this.gamecontroller.gamesettings.settings.levelname = this.levelname;
    this.gamecontroller.saveGameSettings();
}
    
GameControllerGame.prototype.loadPlayers = function() {
    benchmark("load players - start", "players");
    this.players = new Players();
    var charnames = Object.keys(this.gameloader.characters.characters);
    var players = this.gamecontroller.gamesettings.settings.players;

    var playertotal = 0;
    var numplayers = players ?  Object.keys(players).length : 1;
    numplayers = 1;
    
    var playercharname = charnames[1];
    if (this.gamecontroller.gamesettings.settings.character) playercharname = this.gamecontroller.gamesettings.settings.character;
    
    for (var i = 0; i < numplayers; i++) {
        var charname = "";
        if (i == 0) charname = playercharname;
        else {
            var rando = random(0, charnames.length - 1);
            charname = charnames[rando];
        }
        var player = this.loadPlayerCharacter(charname);
        
        var camera = ((i == 0) && (this.gamecontroller.gamesettings.settings.camera && this.gamecontroller.gamesettings.settings.camera.follow));
        this.addPlayerCharacter(player, camera);
        
        playertotal++;
    }
    this.players.shadow.draw = false;
    
    
    this.input.setPlayers(this.players);
    this.loop.loadPlayers(this.players);
    this.loop.loadNPCs(this.npcs);
    benchmark("load players - end", "players");
}

GameControllerGame.prototype.loadViews = function() {
    this.loop.hideViews();
    var w = this.width;
    var h = this.height;
    var s = this.scale;
    this.view = new PartyView(this.gamecontroller, "game-canvas", w, h, s);
    this.loop.loadViews(new Array(this.view));
}

GameControllerGame.prototype.start = function() {
    this.started = true;
    this.loop.start();
    this.loop.showViews();
    this.running = true;
    this.initGamepads();
    this.startPlayers();
}

GameControllerGame.prototype.startPlayers = function() {
    for (var i = 0; i < this.players.players.length; i++) {
        this.loop.game.world.worldcollider.resetPlayer(this.players.players[i], 1);
    }
}

GameControllerGame.prototype.reset = function() {
    this.loop.reset(timestamp());
}

GameControllerGame.prototype.run = function(when) {
    this.loop.run(when);
}

GameControllerGame.prototype.pause = function(when, render) {
    this.loop.pause(when, render);
    this.hideGamepads();
}

GameControllerGame.prototype.resume = function(when) {
    this.loop.resume(when);
    this.showGamepads();
}

GameControllerGame.prototype.stop = function() {
    this.loop.stop();
    this.hideGamepads();
    this.running = false;
}

GameControllerGame.prototype.resize = function() {
    this.loop.resize();
}

GameControllerGame.prototype.addPlayer = function(charname) {
    var character = this.loadPlayerCharacter(charname);
    var player = this.addPlayerCharacter(character);
    this.loop.game.world.worldcollider.resetPlayer(player);
}

GameControllerGame.prototype.loadPlayerCharacter = function(charname) {
    var character = this.gameloader.characters.characters[charname];
    if (!character) {
        logDev("Unable to Add Character: No character named " + charname);
        return;
    }
    var charanims = new Array();
    for (var a in character.animations) charanims[character.animations[a]] = this.gameloader.animations.animations[character.animations[a]];
    var char = new Character().loadJson(character.json);
    char.setAnimator(new CharacterAnimator(charanims));
    char.setRenderer(new CharacterRenderer());
    return char;
}
    
GameControllerGame.prototype.addPlayerCharacter = function(character, camera = false) {
    var name = character.name;
    var color = character.color;

    var x = 0;
    var y = 0;
    var z = 0;
    var width = character.width;
    var height = character.height;
    var speed = 3;
    var hp = 1000;

    var player = new Player(this.players.players.length, name, color, x, y, z, width, height, speed, character, hp, this);
    player.getscamera = camera;
    this.players.addPlayer(player);
    
    updateDevPlayers(this.players.players);
    
    return player;
}

GameControllerGame.prototype.changePlayerCharacter = function(player, charname) {
    var character = this.gameloader.characters.characters[charname];
    if (!character) {
        logDev("Change Player Character - No such Character named " + charname);
        return;
    }
    var character = this.loadPlayerCharacter(charname);
    player.setCharacter(character);
    this.gamecontroller.gamesettings.settings.character = charname;
    this.gamecontroller.saveGameSettings();
}

GameControllerGame.prototype.removePlayer = function(player) {
    this.loop.removePlayer(player);
    this.players.removePlayer(player);
    this.npcs.removeNPC(player);
}

GameControllerGame.prototype.updatePlayerCamera = function(player, camera) {
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

GameControllerGame.prototype.playerDied = function(player) {
    this.loop.game.world.worldcollider.resetPlayer(player);
}