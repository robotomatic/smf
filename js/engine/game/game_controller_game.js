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

    this.gamequality = new GameQuality(this, 1);
    
    this.hiddenegamepads = false;
    this.dogamepads = false;
    
    return this;
}

GameControllerGame.prototype.initGamepads = function() { 
    var gamepads = document.getElementById("gamepads");
    if (!gamepads) return;
    if (isMobile() || isTablet()) {
        this.dogamepads = true;
        show(gamepads);
    } else {
        this.dogamepads = false;
        hide(gamepads);
    }
    if (__dev) updateDevViewOverlay();
}

GameControllerGame.prototype.hideGamepads = function() { 
    var gamepads = document.getElementById("gamepads");
    if (!gamepads) return;
    if (isVisible(gamepads)) {
        this.dogamepads = false;
        this.hiddenegamepads = true;
        hide(gamepads);
    }
}

GameControllerGame.prototype.showGamepads = function() { 
    var gamepads = document.getElementById("gamepads");
    if (!gamepads) return;
    if (this.hiddenegamepads) {
        this.dogamepads = true;
        this.hiddenegamepads = false;
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
        this.changeLevelThemes(themes);
    }
    this.loop.loadMaterials(this.gameloader.materials);
    this.loop.loadLevel(level);
    this.gamecontroller.gamesettings.settings.levelname = this.levelname;
    this.gamecontroller.saveGameSettings();
}

GameControllerGame.prototype.loadLevelThemes = function(themes) {
    for (var i = 0; i < themes.length; i++) {
        var themename = themes[i];
        var theme = this.gameloader.themes.getThemeByName(themename);
        if (theme) this.loop.loadTheme(theme);
    }
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
        var isnpc = i > 0;
        this.addPlayerCharacter(player, isnpc, camera);
        
        
        playertotal++;
    }
    
    this.input.setPlayers(this.players);
    this.loop.loadPlayers(this.players);
    this.loop.loadNPCs(this.npcs);
    benchmark("load players - end", "players");
}

GameControllerGame.prototype.loadViews = function() {
    this.loop.hideViews();
    this.view = new View(this, "game-canvas", this.gamequality, this.onclick);
    this.loop.loadViews(new Array(this.view));
}

GameControllerGame.prototype.resetViews = function() {
    this.loop.gameworld.resetViews();
}

GameControllerGame.prototype.onclick = function(e, controller) {
    /*
    toggleFullScreen();
    controller.resize();
    */
    if (controller.paused) return;
    if (e.target.id != "gamecanvas") return;
    controller.view.renderer.camera.shakeScreen(1.2, 800);
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
        this.loop.gameworld.world.worldcollider.resetPlayer(this.players.players[i], 1);
    }
}

GameControllerGame.prototype.reset = function() {
    this.loop.reset(timestamp());
}

GameControllerGame.prototype.run = function(when, paused) {
    this.loop.run(when, paused);
}

GameControllerGame.prototype.pause = function(when, render) {
    this.loop.pause(when, render);
    var gp = this.dogamepads;
    this.hideGamepads();
    this.dogamepads = gp;
}

GameControllerGame.prototype.resume = function(when) {
    this.loop.resume(when);
    if (this.dogamepads) this.showGamepads();
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
    this.loop.gameworld.world.worldcollider.resetPlayer(player);
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
    char.loadAnimations(charanims);
    return char;
}
    
GameControllerGame.prototype.addPlayerCharacter = function(character, isnpc = true, camera = false) {
    
    var pt = this.players.players.length;
    
    var name = "Player-" + pt;
    var color = character.color;

    var x = 0;
    var y = 0;
    var z = 0;
    var width = character.width;
    var height = character.height;
    var speed = 3;
    var hp = 1000;

    var player = new Player(pt, name, color, x, y, z, width, height, speed, character, hp, this);
    player.isNPC = isnpc;
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
    this.loop.gameworld.world.worldcollider.resetPlayer(player);
}






GameControllerGame.prototype.changeWorldTheme = function(themename, index, active) {
    var world = this.loop.gameworld.world;
    var worldthemes = world.getThemes();
    var newthemes = new Array();
    for (var i = 0; i < worldthemes.length; i++) {
        var worldtheme = worldthemes[i];
        var worldthemename = worldtheme.name;
        if (i == index && active) newthemes.push(themename);
        if (worldtheme.name == themename) continue;
        newthemes.push(worldthemename);
    }
    if (index >= worldthemes.length && active) {
        newthemes.push(themename);
    }
    world.resetRendererCollider();
    this.changeLevelThemes(newthemes);
    world.updateThemes();
}

GameControllerGame.prototype.changeLevelThemes = function(themes) {
    this.loop.unloadThemes();
    this.loadLevelThemes(themes);
}

