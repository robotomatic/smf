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
    var l = this.gameloader.levels[this.levelsettings.levelname];
    this.gameloader.loadLevelFile(l.file, function() {
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
    var t = Object.keys(players).length;
    for (var i = 0; i < t; i++) {
        var player = players[i];
        if (!player.start || !player.ready) continue;
        var character = this.gameloader.characters[charnames[player.character]];
        var charanims = new Array();
        for (var a in character.animations) charanims[character.animations[a]] = this.gameloader.animations[character.animations[a]];
        character.setAnimator(new CharacterAnimator(charanims));
        character.setRenderer(new CharacterRenderer());
        var name = character.name;
        var color = character.color;
        var x = (this.level.width / 2 - (50 * (t / 2))) + (50 * i);
        var y = 10;
        var width = character.width;
        var height = character.height;
        var speed = 3.5;
        var pc = new Player(i, name, color, x, y, width, height, speed, character);
        this.players.addPlayer(pc);
    }
    this.loop.loadPlayers(this.players.players);

    // todo: fix this shit
    var currentchar = 0;
    input.mapPlayerKeys(this.players.players[currentchar], {87: "jump", 65: "left", 68: "right"});
    input.mapPlayerKeys(this.players.players[currentchar], {38: "jump", 37: "left", 39: "right"});
    
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
}

GameParty.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

GameParty.prototype.resize = function() {
    this.loop.resize();
}