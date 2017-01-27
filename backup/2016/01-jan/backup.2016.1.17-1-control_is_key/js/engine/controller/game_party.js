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
    var controller = this;
    var level = this.gameloader.levels[this.levelsettings.levelname];
    if (!level) {
        var k = Object.keys(this.gameloader.levels);
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
    var charnames = Object.keys(this.gameloader.characters);
    var players = this.playersettings.players;
    var playertotal = 0;
    for (var i = 0; i < Object.keys(players).length; i++) {
        var player = players[i];
        if (!player.start || !player.ready) continue;
        var character = this.gameloader.characters[charnames[player.character]];
        
        var charanims = new Array();
        for (var a in character.animations) charanims[character.animations[a]] = this.gameloader.animations[character.animations[a]];
        
        character.setAnimator(new CharacterAnimator(charanims));
        character.setRenderer(new CharacterRenderer());
        var name = character.name;
        var color = character.color;
        
        var spacing = 200;
        
        var x = (this.level.width / 2 - (spacing * (playertotal / 2))) + (spacing * i);
        var y = 10;
        var width = character.width;
        var height = character.height;
        
        var speed = 3.5;
        var hp = 1000;
        
        var pc = new Player(i, name, color, x, y, width, height, speed, character, hp, this);
        this.players.addPlayer(pc);
        
        playertotal++;
    }

    this.input.setPlayers(this.players);
    
    this.players.sortByHeight();
    this.loop.loadPlayers(this.players.players);
    
    this.loop.hideViews();
    var w = 1400;
    var h = 690;
    var s = 2;
    this.view = new PartyView("game-canvas", this.players, w, h, s);
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
    for (var i = 0; i < this.players.players.length; i++) this.level.resetPlayer(this.players.players[i], 2000);
}

GameParty.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

GameParty.prototype.resize = function() {
    this.loop.resize();
}

GameParty.prototype.playerDied = function(player) {
    var controller = this;
    setTimeout(function() {
        controller.level.resetPlayer(player);
    }, 1000);
}