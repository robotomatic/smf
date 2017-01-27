"use strict";

/*

TODO:

 need canvas for each parallax layer
 
 -webkit-filter: blur(5px)
 
 ***blur can be animated!!!!!

*/



function GameParty(gamecontroller, gamesettings, levelsettings, playersettings) {
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
    
    
    var mobile = isMobile();
    
    if (mobile) {
        this.width = 800;
        this.height = 600;

        this.scale = 2;
        this.levelquality = 1;
        this.playerquality = 2;
    } else {
        this.width = 1024;
        this.height = 768;

        this.scale = 2;
        this.levelquality = 1;
        this.playerquality = 2;
    }
    
    this.load();
    return this;
}

GameParty.prototype.getSettings = function() { return this.settings; }

GameParty.prototype.load = function() {
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

GameParty.prototype.loadLevel = function() {

    this.level = this.gameloader.level;
    
    var themes = this.gameloader.levels[this.levelname].themes;
    if (themes) {
        var themkeys = Object.keys(themes);
        for (var i = 0; i < themkeys.length; i++) {
            var themename = themes[themkeys[i]];
            this.level.loadTheme(themename, this.gameloader.themes.themes[themename]);
        }
    }

    
    
    this.loop.loadLevel(this.level);
    
    this.players = new Players();
    var charnames = Object.keys(this.gameloader.characters.characters);
    var players = this.playersettings.players;
    var playertotal = 0;
    for (var i = 0; i < Object.keys(players).length; i++) {
        var player = players[i];
        //if (!player.start || !player.ready) continue;
        
        
        var character = this.gameloader.characters.characters[player.charactername];
        
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
        var width = character.width;
        var height = character.height;
        
        var speed = 3.5;
        var hp = 1000;
        
        var pc = new Player(i, name, color, x, y, width, height, speed, char, hp, this);
        
        if (this.level.speed) pc.controller.speed = this.level.speed;
        if (this.level.jumpspeed) pc.controller.jumpspeed = this.level.jumpspeed;
        
        this.players.addPlayer(pc);
        
        playertotal++;
    }

    this.players.shadow.draw = false;
    this.input.setPlayers(this.players);
    
    this.loop.loadPlayers(this.players);
    
    this.loop.hideViews();
    
    var w = this.width;
    var h = this.height;
    var s = this.scale;
    var lq = this.levelquality;
    var pq = this.playerquality;
    
    this.view = new PartyView("game-canvas", w, h, s, lq, pq);
    this.loop.loadViews(new Array(this.view));
    
    if (!this.running && this.started) {
        this.resize();
        this.start();
    }
}


GameParty.prototype.start = function() {
    this.started = true;
    if (!this.level) return;
    this.loop.start();
    this.loop.showViews();
    this.running = true;
    this.startPlayers();
}

GameParty.prototype.startPlayers = function() {
    for (var i = 0; i < this.players.players.length; i++) this.level.resetPlayer(this.players.players[i], 1);
}

GameParty.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

GameParty.prototype.resize = function() {
    this.loop.resize();
}

GameParty.prototype.playerDied = function(player) {
    this.level.resetPlayer(player);
}