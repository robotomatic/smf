MenuPlayer = function(loader) {
    this.loop = new GameLoop();
    this.level = loader.level;
    this.characters = loader.characters;
    this.animations = loader.animations;
    this.charspace = 75;
    this.currentchar = localStorage.getItem("player-character");
    if (!this.currentchar) this.currentchar = 0;
    this.load();
    return this;
}

MenuPlayer.prototype.menu = new Menu();

MenuPlayer.prototype.load = function() {
    this.loop.loadLevel(this.level);
    var players = new Players();
    var npcs = new NPCs();
    var mid = this.level.width / 2;
    var playerx = mid - (this.currentchar * this.charspace); 
    var chars = this.characters;
    for (var charname in chars) {
        var character = chars[charname];
        var charanims = new Array();
        for (var a in character.animations) charanims[character.animations[a]] = this.animations[character.animations[a]];
        character.setAnimator(new CharacterAnimator(charanims));
        character.setRenderer(new CharacterRenderer());
        var pw = character.width ? character.width : 20;
        var ph = character.height ? character.height : 25;
        var pdiff = (20 - pw) / 2;
        var player = new Player(character.name, "", playerx + pdiff, 500, pw, ph, 1, character);
        player.lookThreshold = .1;
        players.addPlayer(player);
        var npc = new NPC(player);
        npcs.addNPC(npc);
        playerx += this.charspace;
    }
    this.loop.loadPlayers(players.getPlayers());
    this.loop.loadNPCs(npcs);
    this.loadView();
}

MenuPlayer.prototype.loadView = function() {
    var views;
    var menubox = {
        "x" : 5000,
        "y" : 600,
        "width" : 20,
        "height" : 25
    }
    this.loop.hideViews();
    var z = 20;
    var w = 1200, h = 600;
    this.loop.loadViews(new Array(new MenuView("menu-canvas", menubox, w, h, z)));
    this.loadUI();
}

MenuPlayer.prototype.loadUI = function() {
    var menu = this;
    var prev = document.getElementById("menu-game-player-view-player-button-prev");
    if (prev) prev.onclick = function(e) {
        menu.showPrevCharacter();
        e.preventDefault();
        return false;
    }
    var next = document.getElementById("menu-game-player-view-player-button-next");
    if (next) next.onclick = function(e) {
        menu.showNextCharacter();
        e.preventDefault();
        return false;
    }
}

MenuPlayer.prototype.start = function() {
    this.loop.start();
    this.loop.showViews();
    this.running = true;
}

MenuPlayer.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

MenuPlayer.prototype.resize = function() {
    this.loop.resize();
    this.menu.resize();
    this.showCharacterName();
}

MenuPlayer.prototype.showPrevCharacter = function() {
    if (this.busy) return;
    this.busy = true;
    var m = document.getElementById("menu-text");
    fadeOutFast(m);
    var keys = Object.keys(this.characters);
    var total = keys.length - 1;
    var currentchar = this.currentchar;
    var menu = this;
    if (currentchar == 0) {
        var movedchars = 0;
        for (var i = 1; i <= total; i++) {
            this.loop.stage.npcs.npcs[i].doAction("moveTo", { "x" : -(this.charspace * (total + 1)) }, "", null, function() {
                if (movedchars++ == total - 1) {
                    menu.loop.doAction("right", true, "x", menu.charspace, function() { 
                        menu.loop.stage.npcs.npcs[0].doAction("moveTo", { "x" : -(menu.charspace * (total + 1)) }, "", null, function() {
                            menu.setCurrentCharacter(total);
                            menu.showCharacterName(); 
                            menu.busy = false;
                            return;
                        });
                    });
                }
            });
        }
        return;
    }
    this.loop.doAction("right", true, "x", this.charspace, function() { 
        menu.busy = false;
        menu.setCurrentCharacter(--currentchar);
        menu.showCharacterName(); 
    });
}

MenuPlayer.prototype.showNextCharacter = function() {
    if (this.busy) return;
    this.busy = true;
    var m = document.getElementById("menu-text");
    fadeOutFast(m);
    var keys = Object.keys(this.characters);
    var total = keys.length - 1;
    var currentchar = this.currentchar;
    var menu = this;
    if (currentchar == total) {
        var movedchars = 0;
        for (var i = 0; i < total; i++) {
            this.loop.stage.npcs.npcs[i].doAction("moveTo", { "x" : (this.charspace * (total + 1)) }, "", null, function() {
                if (movedchars++ == total - 1) {
                    menu.loop.doAction("left", true, "x", -menu.charspace, function() { 
                        menu.loop.stage.npcs.npcs[total].doAction("moveTo", { "x" : (menu.charspace * (total + 1)) }, "", null, function() {
                            menu.setCurrentCharacter(0);
                            menu.showCharacterName(); 
                            menu.busy = false;
                            return;
                        });
                        menu.setCurrentCharacter(0);
                        menu.showCharacterName(); 
                        menu.busy = false;
                        return;
                    });
                }
            });
        }
        return;
    }
    this.loop.doAction("left", true, "x", -this.charspace, function() { 
        menu.busy = false;
        menu.setCurrentCharacter(++currentchar);
        menu.showCharacterName(); 
    });
}

MenuPlayer.prototype.setCurrentCharacter = function(current) {
    this.currentchar = current;
   localStorage.setItem("player-character", this.currentchar);
}

MenuPlayer.prototype.showCharacterName = function() {
    if (!this.characters) return;
    var m = document.getElementById("menu-text");
    if (!m) return;
    var p = m.parentNode;
    var pw = p.offsetWidth;
    var fs = Number(pw / 25);
    if (fs > 15) fs = 15;
    m.style.fontSize = fs + "px";
    var keys = Object.keys(this.characters);
    m.innerHTML = this.characters[keys[this.currentchar]].name;
    fadeInFast(m);
}