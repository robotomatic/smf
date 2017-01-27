"use strict";

function GameParty(gamecontroller, gamesettings, levelsettings, playersettings) {
    this.gamecontroller = gamecontroller;
    this.devtools =     this.gamecontroller.devtools;
    this.input = this.gamecontroller.input;
    this.loop = new GameLoop(this.input, this.gamecontroller.devtools);
    this.gameloader = this.gamecontroller.gameloader;
    this.level = null;
    this.players = null;
    this.gamesettings = gamesettings;
    this.levelsettings = levelsettings;
    this.playersettings = playersettings;
    this.view = null;
    this.started = false;
    this.load();
    return this;
}

GameParty.prototype.getSettings = function() { return this.settings; }

GameParty.prototype.load = function() {
    let controller = this;
    let level = this.gameloader.levels[this.levelsettings.levelname];
    if (!level) {
        let k = Object.keys(this.gameloader.levels);
        level = this.gameloader.levels[k[0]];
    }
    this.gameloader.loadLevelFile(level.file, function() {
        controller.loadLevel();
    })
}

GameParty.prototype.loadLevel = function() {

    this.level = this.gameloader.level;
    this.level.setTheme(this.gameloader.themes[this.level.theme]);
    this.loop.loadLevel(this.level);
    
    this.players = new Players();
    let charnames = Object.keys(this.gameloader.characters);
    let players = this.playersettings.players;
    let playertotal = 0;
    for (let i = 0; i < Object.keys(players).length; i++) {
        let player = players[i];
        if (!player.start || !player.ready) continue;
        
        let character = this.gameloader.characters[charnames[player.character]];
        
        if (!character) character = this.gameloader.characters[charnames[0]];
        
        let charanims = new Array();
        for (let a in character.animations) charanims[character.animations[a]] = this.gameloader.animations[character.animations[a]];
        
        let char = new Character().loadJson(character.json);
        char.setAnimator(new CharacterAnimator(charanims));
        char.setRenderer(new CharacterRenderer());
        let name = character.name;
        let color = character.color;
        
        let spacing = 200;
        
        let x = (this.level.width / 2 - (spacing * (playertotal / 2))) + (spacing * i);
        let y = 10;
        let width = character.width;
        let height = character.height;
        
        let speed = 3.5;
        let hp = 1000;
        
        let pc = new Player(i, name, color, x, y, width, height, speed, char, hp, this);
        
        if (this.level.speed) pc.speed = this.level.speed;
        if (this.level.jumpspeed) pc.jumpspeed = this.level.jumpspeed;
        
        this.players.addPlayer(pc);
        
        playertotal++;
    }

    this.input.setPlayers(this.players);
    
    this.players.sortByHeight();
    this.loop.loadPlayers(this.players.players);
    
    this.loop.hideViews();
    let w = 1400;
    let h = 690;
    
    let s = 2;
    
    this.view = new PartyView("game-canvas", this.players, w, h, s);
    if (this.level.zoompad) {
        this.view.viewpad = this.level.zoompad;
        this.view.playerpad = this.level.zoompad;
    }
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
    for (let i = 0; i < this.players.players.length; i++) this.level.resetPlayer(this.players.players[i], 1);
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