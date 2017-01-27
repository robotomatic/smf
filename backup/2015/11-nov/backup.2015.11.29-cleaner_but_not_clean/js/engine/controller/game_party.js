function GameParty(gameloader, devtools, gamesettings, levelsettings, playersettings) {
    this.loop = new GameLoop(devtools);
    this.gameloader = gameloader;
    this.level = null;
    this.players = null;
    this.devtools = devtools;
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
        
        var charanims = copyArray(this.gameloader.animations);
        
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
    this.loop.loadPlayers(this.players.players);

    // todo: fix this shit
    
    input.mapPlayerKeys(this.players.players[0], {87: "jump", 65: "left", 68: "right"});
    
    if (playertotal > 1) input.mapPlayerKeys(this.players.players[1], {38: "jump", 37: "left", 39: "right"});
    else  input.mapPlayerKeys(this.players.players[0], {38: "jump", 37: "left", 39: "right"});
    
    if (playertotal > 2) input.mapPlayerKeys(this.players.players[2], {104: "jump", 100: "left", 102: "right"});
    if (playertotal > 3) input.mapPlayerKeys(this.players.players[3], {80: "jump", 76: "left", 222: "right"});
    
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