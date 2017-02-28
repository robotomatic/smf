"use strict";

function GameControllerGame(gamecontroller, gamesettings, levelsettings, playersettings) {
    this.gamecontroller = gamecontroller;
    this.input = this.gamecontroller.input;
    this.loop = new GameLoop(this.input);
    this.gameloader = this.gamecontroller.gameloader;
    this.level = null;
    this.levelname = "";
    this.players = null;
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
    
    this.load();
    return this;
}

GameControllerGame.prototype.getSettings = function() { return this.settings; }

GameControllerGame.prototype.load = function() {
    var controller = this;
    var level = this.gameloader.levels[this.levelsettings.levelname];
    if (level) {
        this.levelname = this.levelsettings.levelname;
    } else {
        var k = Object.keys(this.gameloader.levels);
        level = this.gameloader.levels[k[0]];
        this.levelname = k[0];
    }
    this.gameloader.loadLevelFile(level.file, function() {
        controller.loadLevel();
    })
}

GameControllerGame.prototype.loadLevel = function() {

    this.level = this.gameloader.level;
    
    var themes = this.gameloader.levels[this.levelname].themes;
    if (themes) {
        var themkeys = Object.keys(themes);
        for (var i = 0; i < themkeys.length; i++) {
            var themename = themes[themkeys[i]];
            this.level.loadTheme(themename, this.gameloader.themes.themes[themename], this.gameloader.materials);
        }
    }

    
    
    this.loop.loadLevel(this.level);
    
    this.players = new Players();
    var charnames = Object.keys(this.gameloader.characters.characters);
    var players = this.playersettings.players;
    if (players) players.length = 0;
    
    var playertotal = 0;
    
    var numplayers = players ?  Object.keys(players).length : 1;
    
    
    numplayers = 3;
    for (var i = 0; i < numplayers; i++) {

        var charname = "";
        if (i == 0) charname = charnames[1];
        else charname = charnames[0];
        
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
        
        var x = (this.level.width / 2 - (spacing * (playertotal / 2))) + (spacing * i);
        var y = 10;
        var z = 0;
        var width = character.width;
        var height = character.height;
        
        if (i > 0) {
            width *= 2;
            height *= 2;
        }
        
        
        var speed = 3;
        var hp = 1000;
        
        var pc = new Player(i, name, color, x, y, z, width, height, speed, char, hp, this);
        if (i == 0) pc.getscamera = true;
        
        if (this.level.speed) pc.controller.speed = this.level.speed;
        if (this.level.jumpspeed) pc.controller.jumpspeed = this.level.jumpspeed;
        
        this.players.addPlayer(pc);
        
        playertotal++;
    }
    
    if (playertotal > 1) {
        setFOV(this.fov + 100);
    }

    this.players.shadow.draw = false;
    this.input.setPlayers(this.players);
    
    this.loop.loadPlayers(this.players);
    
    this.loop.hideViews();
    
    var w = this.width;
    var h = this.height;
    var s = this.scale;
    
    this.view = new PartyView("game-canvas", w, h, s);
    this.loop.loadViews(new Array(this.view));
    
    if (!this.running && this.started) {
        this.resize();
        this.start();
    }
}


GameControllerGame.prototype.start = function() {
    this.started = true;
    if (!this.level) return;
    this.gamecontroller.initDebug();
    this.loop.start();
    this.loop.showViews();
    this.running = true;
    this.startPlayers();
}

GameControllerGame.prototype.startPlayers = function() {
    for (var i = 0; i < this.players.players.length; i++) this.level.resetPlayer(this.players.players[i], 1);
}

GameControllerGame.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

GameControllerGame.prototype.resize = function() {
    this.loop.resize();
}

GameControllerGame.prototype.playerDied = function(player) {
    this.level.resetPlayer(player);
}