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
    this.loop.loadPlayers(this.players.players);

    // todo: fix this shit
    var p1 = 0;
    var p2 = (playertotal == 1) ? 0 : 1;
    
    input.mapPlayerKeys(this.players.players[p1], {87: "jump", 65: "left", 68: "right"});
    input.mapPlayerKeys(this.players.players[p2], {38: "jump", 37: "left", 39: "right"});
    
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


GameParty.prototype.playerDied = function(player) {
    var controller = this;
    setTimeout(function() {
        controller.resetPlayer(player);
    }, 1000);
}

GameParty.prototype.resetPlayer = function(player) {

    player.stop();
    
    var lw = this.level.width / 2;
    var py = 50;
    var px;
    var safe = false;
    while (!safe) {
        px = random(0, lw) + (lw / 2);
        var sp = new Point(px, py);
        safe = this.checkPlayerSpawnPoint(player, sp);
        if (safe) {
            px = safe.x;
        }
    }

    player.ready = false;
    
    player.x = px;
    player.y = py;
    player.groundpoint.x = px;
    player.groundpoint.y = py;
    player.jumpstarty = py;

    setTimeout(function() {
        player.alive = true;
        player.ready = true;
        player.hp = player.maxhp;
    }, 1000);
}

GameParty.prototype.checkPlayerSpawnPoint = function(player, spawnpoint) {
    var safe = false;
    var lh = this.level.height;
    var pw = player.width / 2;
    var px = spawnpoint.x - pw;
    var rect = new Rectangle(px, 0, pw, lh);
    for (var i = 0; i < this.level.layers.length; i++) {
        var layer = this.level.layers[i];
        if (!layer.collide || layer.draw == false) continue;
        for (var ii = 0; ii < layer.items.length; ii++) {
            var item = layer.items[ii];
            if (item.gravity || item.viscosity || item.physics || item.actions) continue;
            
            var col = collideRough(rect, item);
            if (col) {
                var ix = item.x;
                var iw = item.width;
                
                var buffer = pw * 4;
                var npx = px;
                
                if ((Math.abs(ix - px) < buffer) || (Math.abs((ix + iw) - px) < buffer)) npx = ix + (iw / 2) - pw;
                
                safe = new Point(npx, item.y);
                break;
            }
        }
    }
    return safe;
}
