function GameParty(gameinfo, devtools, settings) {
    this.loop = new GameLoop(devtools, settings);
    this.gameinfo = gameinfo;
    this.level = null;
    this.players = null;
    this.devtools = devtools;
    this.settings = settings;
    this.load();
    return this;
}

GameParty.prototype.getSettings = function() { return this.settings; }

GameParty.prototype.load = function() {
    this.level = this.gameinfo.level;
    this.loop.loadLevel(this.level);
    
    this.players = this.gameinfo.players;
    this.loop.loadPlayers(this.players.players);

    var currentchar = 0;

    // todo: fix this shit
    input.mapPlayerKeys(this.players.players[currentchar], {87: "jump", 65: "left", 68: "right"});
    input.mapPlayerKeys(this.players.players[currentchar], {38: "jump", 37: "left", 39: "right"});
    
    this.loop.hideViews();
    var w = 1400;
    var h = 690;
    var s = 2;
    this.loop.loadViews(new Array(new PartyView("game-canvas", this.players, w, h, s)));
}

GameParty.prototype.start = function() {
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