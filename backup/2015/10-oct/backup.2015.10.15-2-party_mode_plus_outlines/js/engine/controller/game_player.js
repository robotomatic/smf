function GamePlayer(loader, devtools, settings) {
    this.loop = new GameLoop(devtools, settings);
    this.level = loader.level;
    this.items = loader.items;
    this.characters = loader.characters;
    this.animations = loader.animations;
    this.players = loader.players;
    this.settings = settings;
    this.load();
    return this;
}

GamePlayer.prototype.getSettings = function() { return this.settings; }

GamePlayer.prototype.load = function() {
    
    this.loop.loadLevel(this.level);
    this.level.setItemRenderer(this.items);
    
    var chars = this.characters;
    for (var i = 0; i < this.players.length; i++) {
        var playerchar = this.players[i].character_name;
        var character = chars[playerchar];
        var charanims = new Array();
        for (var a in character.animations) charanims[character.animations[a]] = this.animations[character.animations[a]];
        character.setAnimator(new CharacterAnimator(charanims));
        character.setRenderer(new CharacterRenderer());
        this.players[i].setCharacter(character);
    }
    this.loop.loadPlayers(this.players);

    var currentchar = localStorage.getItem("player-character");

    // todo: fix this shit
    input.mapPlayerKeys(this.players[currentchar], {87: "jump", 65: "left", 68: "right"});
    input.mapPlayerKeys(this.players[currentchar], {38: "jump", 37: "left", 39: "right"});
    
    this.loop.hideViews();
    var z = 3.5;
    var w = 1400, h = 690;
    var scale = 2;
    this.loop.loadViews(new Array(new PlayerView("player-canvas", this.players[currentchar], w, h, z, scale)));
}

GamePlayer.prototype.start = function() {
    this.loop.start();
    this.loop.showViews();
    this.running = true;
}

GamePlayer.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

GamePlayer.prototype.resize = function() {
    this.loop.resize();
}