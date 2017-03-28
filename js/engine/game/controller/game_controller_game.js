"use strict";

function GameControllerGame(gamecontroller, gamesettings, levelsettings, playersettings) {
    this.gamecontroller = gamecontroller;
    this.input = this.gamecontroller.input;
    this.loop = new GameLoop(this.input);
    this.gameloader = this.gamecontroller.gameloader;
    this.levelname = "";
    
    this.players = new Players();
    this.npcs = new NPCs();
    
    this.gamesettings = gamesettings;
    this.levelsettings = levelsettings;
    this.playersettings = playersettings;
    this.view = null;
    this.started = false;

    this.width = 100;
    this.height = 100;
    this.fov = 10;
    this.scale = 0;
    this.device = "";
    this.gamequality = new GameQuality(this, 1);
    
    this.initGamepads();
    
    return this;
}

GameControllerGame.prototype.initGamepads = function() { 
    gamepads = document.getElementById("gamepads");
    if (!gamepads) return;
    if (isMobile() || isTablet()) show(gamepads);
    else hide(gamepads);
}

GameControllerGame.prototype.getSettings = function() { return this.settings; }

GameControllerGame.prototype.load = function(callback) {
    var controller = this;
    var level = this.gameloader.levels[this.levelsettings.levelname];
    if (level) {
        this.levelname = this.levelsettings.levelname;
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
}
    
GameControllerGame.prototype.loadPlayers = function() {
    
    benchmark("load players - start", "players");
    
    this.players = new Players();
    var charnames = Object.keys(this.gameloader.characters.characters);
    var players = this.playersettings.players;
    if (players) players.length = 0;
    
    var playertotal = 0;
    
    var numplayers = players ?  Object.keys(players).length : 1;
    
    
    numplayers = 1;
    for (var i = 0; i < numplayers; i++) {

        var charname = "";
        if (i == 0) charname = charnames[1];
        else {
            var rando = random(0, charnames.length - 1);
            charname = charnames[rando];
        }
        
//                var charname = charnames[i + 1];

//        if (players) {
//            var player = players[i];
//            if (!player) continue;
//            charname = player.charactername;
//        }
        //if (!player.start || !player.ready) continue;
        
        var character = this.gameloader.characters.characters[charname];
        
        if (!character) character = this.gameloader.characters.characters[charnames[0]];
        
        var charanims = new Array();
        for (var a in character.animations) charanims[character.animations[a]] = this.gameloader.animations.animations[character.animations[a]];
        
        var char = new Character().loadJson(character.json);
        char.setAnimator(new CharacterAnimator(charanims));
        char.setRenderer(new CharacterRenderer());
        var name = character.name;
        var color = character.color;
        
        var spacing = 200;
        
        var x = 0;
        var y = 0;
        var z = 0;
        var width = character.width;
        var height = character.height;
        
        if (i > 0) {
//            width *= 2;
//            height *= 2;
        }
        
        var speed = 3;
        var hp = 1000;
        
        var pc = new Player(i, name, color, x, y, z, width, height, speed, char, hp, this);
        if (i == 0) pc.getscamera = true;
        
        this.players.addPlayer(pc);
        
        playertotal++;
    }
    
    if (playertotal > 1) {
//        setFOV(this.fov + 100);
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
}

GameControllerGame.prototype.resume = function(when) {
    this.loop.resume(when);
}

GameControllerGame.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

GameControllerGame.prototype.resize = function() {
    this.loop.resize();
}

GameControllerGame.prototype.removePlayer = function(player) {
    this.loop.removePlayer(player);
    this.players.removePlayer(player);
    this.npcs.removeNPC(player);
}

GameControllerGame.prototype.playerDied = function(player) {
    this.loop.game.world.worldcollider.resetPlayer(player);
}