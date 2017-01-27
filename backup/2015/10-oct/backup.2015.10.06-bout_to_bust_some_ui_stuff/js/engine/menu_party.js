function MenuParty(loader, playernum) {
    this.playernum = playernum;
    this.loop = new GameLoop();
    this.level = loader.level;
    this.characters = loader.characters;
    this.animations = loader.animations;
    this.devtools = loader.devtools;
    this.charspace = 100;
    this.currentchar = localStorage.getItem("player-character-" + this.playernum);
    this.ui = document.getElementById("menu-canvas-" + this.playernum + "-ui");
    if (!this.currentchar) this.currentchar = playernum - 1;
    this.load();
    return this;
}

MenuParty.prototype.menu = new Menu();

MenuParty.prototype.load = function() {
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
        var player = new Player(character.name, "", playerx + pdiff, 10, pw, ph, 1, character);
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

MenuParty.prototype.loadView = function() {
    var views;
    var menubox = {
        "x" : 5000,
        "y" : 30,
        "width" : 20,
        "height" : 25
    }
    this.loop.hideViews();
    var z = 15;
    var w = 1200, h = 600;
    var dev = JSON.parse(JSON.stringify(this.devtools));
    this.loop.loadViews(new Array(new CharacterView("menu-canvas-" + this.playernum, this.playernum, menubox, w, h, z, dev)));
    this.loadUI();
}

MenuParty.prototype.loadUI = function() {
    var menu = this;
    var prev = document.getElementById("menu-game-player-view-player-button-prev-" + this.playernum);
    if (prev) {
        prev.onclick = function(e) {
            menu.showPrevCharacter();
            e.preventDefault();
            return false;
        }
    }
    var next = document.getElementById("menu-game-player-view-player-button-next-" + this.playernum);
    if (next) {
        next.onclick = function(e) {
            menu.showNextCharacter();
            e.preventDefault();
            return false;
        }
    }
    var card = document.getElementById("menu-game-player-view-player-button-card-" + menu.playernum);
    var flip = document.getElementById("menu-game-player-view-player-button-flip-" + this.playernum);
    if (flip) {
        flip.onclick = function(e) {
            card.className += " flipped";
            e.preventDefault();
            return false;
        }
        var unflip = document.getElementById("menu-game-player-view-player-button-unflip-" + this.playernum);
        unflip.onclick = function(e) {
            card.className = card.className.replace(/flipped/g, '');
            e.preventDefault();
            return false;
        }
    }
}

MenuParty.prototype.start = function() {
    this.showCharacterName();
    this.loop.start();
    this.loop.showViews();
    this.running = true;
}

MenuParty.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

MenuParty.prototype.resize = function() {
    this.loop.resize();
    this.menu.resize();
    this.showCharacterName();
}

MenuParty.prototype.showPrevCharacter = function() {
    if (this.busy) return;
    this.busy = true;
    fadeOutFast(this.ui);
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

MenuParty.prototype.showNextCharacter = function() {
    if (this.busy) return;
    this.busy = true;
    fadeOutFast(this.ui);
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

MenuParty.prototype.setCurrentCharacter = function(current) {
    this.currentchar = current;
   localStorage.setItem("player-character-" + this.playernum, this.currentchar);
}

MenuParty.prototype.showCharacterName = function() {
    if (!this.characters) return;
    var p = this.ui.parentNode;
    var pw = p.offsetWidth;
    var fs = Number(pw / 25);
    if (fs > 15) fs = 15;
    this.ui.style.fontSize = fs + "px";
    var keys = Object.keys(this.characters);
    this.loop.setMessage(this.characters[keys[this.currentchar]].name);
    fadeInFast(this.ui);
}