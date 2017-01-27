function MenuPlayerChooser(loader, parent, playertotal) {
    this.parent = parent;
    this.loop = new GameLoop();
    this.devtools = loader.devtools;
    this.charspacex = 60;
    this.charspacey = 200;
    this.playertotal = playertotal;
    this.level = loader.level;
    this.characters = loader.characters;
    this.charnames = Object.keys(this.characters);
    this.animations = loader.animations;
    this.chooserui = loader.ui;
    this.currentchars = new Array();
    this.labels = new Array();
    this.players = new Array();
    this.npcs = new Array();
    this.busy = new Array();
    this.load();
    return this;
}

MenuPlayerChooser.prototype.menu = new Menu();

MenuPlayerChooser.prototype.load = function() {
    this.loadLevel();
    this.loadCharacters();
    this.loadChoosers();
    this.loadViews();
}

MenuPlayerChooser.prototype.loadLevel = function() { this.loop.loadLevel(this.level); }

MenuPlayerChooser.prototype.loadCharacters = function() { for (var charname in this.characters) this.loadCharacter(charname); }

MenuPlayerChooser.prototype.loadCharacter = function(charname) {
    var chars = this.characters;
    var character = chars[charname];
    this.loadCharacterAnimations(character);
}
    
MenuPlayerChooser.prototype.loadCharacterAnimations = function(character) {
    var charanims = new Array();
    for (var a in character.animations) charanims[character.animations[a]] = this.animations[character.animations[a]];
    character.setAnimator(new CharacterAnimator(charanims));
    character.setRenderer(new CharacterRenderer());
    return character;
}
    
MenuPlayerChooser.prototype.loadChoosers = function() {
    var chars = this.characters;
    var charnames = this.charnames;
    var players = new Players();
    var npcs = new NPCs();
    for (var i = 0; i < this.playertotal; i++) {
        var character = chars[charnames[i]];
        this.currentchars[i] = i;
        var mid = this.level.width / 2;
        var playerx = mid - (character.width / 2); 
        var playery = 10 + (i * this.charspacey); 
        var player = this.loadPlayer(playerx, playery, character);
        players.addPlayer(player);
        this.players[i] = player;
        var npc = new NPC(player);
        npcs.addNPC(npc);
        this.npcs[i] = npc;
    }
    this.loop.loadPlayers(players.getPlayers());
    this.loop.loadNPCs(npcs);
}

MenuPlayerChooser.prototype.loadPlayer = function(x, y, character) {
    var pw = character.width ? character.width : 20;
    var ph = character.height ? character.height : 25;
    var pdiff = (20 - pw) / 2;
    pdiff = 0;
    
    var char = new Character().loadJson(character.json);
    char = this.loadCharacterAnimations(char);
    
    var player = new Player(character.name, "", x + pdiff, y, pw, ph, 1, char);
    player.lookThreshold = .1;
    return player;
}

MenuPlayerChooser.prototype.loadViews = function() {
    var views = Array();
    for (var i = 0; i < this.playertotal; i++) views[i] = this.loadView(i);
    this.loop.loadViews(views);
}

MenuPlayerChooser.prototype.loadView = function(i) {
    var vx = (this.level.width / 2) - 9;
    var vy = this.charspacey * (i + 1);
    var menubox = {
        "x" : vx,
        "y" : vy,
        "width" : 20,
        "height" : 25
    }
    this.loop.hideViews();
    var z = 15;
    var w = 1200, h = 600;
    var dev = JSON.parse(JSON.stringify(this.devtools));
    this.loadUI(i);
    return new CharacterView(i + "-ui-player-chooser-canvas", i, menubox, w, h, z, i == 3 ? dev : null);
}

MenuPlayerChooser.prototype.loadUI = function(playernum) {
    var div = document.createElement("div");
    var fixed = this.chooserui.replace(/-ui-player-chooser/g, playernum + "-ui-player-chooser");
    div.innerHTML = fixed;
    this.parent.appendChild(div);
    resize();
    document.getElementById(playernum + "-ui-player-chooser-title").innerHTML = "PLAYER " + (playernum + 1);
    this.labels[playernum] = document.getElementById(playernum + "-ui-player-chooser-canvas-text");
    var menu = this;
    var prev = document.getElementById(playernum + "-ui-player-chooser-button-prev");
    if (prev) {
        prev.onclick = function(e) {
            menu.showPrevCharacter(playernum);
            e.preventDefault();
            return false;
        }
    }
    var next = document.getElementById(playernum + "-ui-player-chooser-button-next");
    if (next) {
        next.onclick = function(e) {
            menu.showNextCharacter(playernum);
            e.preventDefault();
            return false;
        }
    }
    var card = document.getElementById(playernum + "-ui-player-chooser-card");
    var flip = document.getElementById(playernum + "-ui-player-chooser-button-flip");
    if (flip) {
        flip.onclick = function(e) {
            card.className += " flipped";
            e.preventDefault();
            return false;
        }
        var unflip = document.getElementById(playernum + "-ui-player-chooser-button-unflip");
        unflip.onclick = function(e) {
            card.className = card.className.replace(/flipped/g, '');
            e.preventDefault();
            return false;
        }
    }
    fadeIn(document.getElementById("ui-player-chooser-main"));
}

MenuPlayerChooser.prototype.start = function() {
    this.showCharacterNames();
    this.loop.start();
    this.loop.showViews();
    this.running = true;
}

MenuPlayerChooser.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

MenuPlayerChooser.prototype.resize = function() {
    this.loop.resize();
    this.menu.resize();
    this.showCharacterNames();
}

MenuPlayerChooser.prototype.showPrevCharacter = function(playernum) {
    if (this.busy[playernum]) return;
    this.busy[playernum] = true;
    fadeOutFast(this.labels[playernum]);
    var current = this.currentchars[playernum];
    var prev = (current == 0) ? this.charnames.length - 1 : --current;
    
    // todo: find first prev char that isn't in use
    
    var currentplayer = this.players[playernum];
    var character = this.characters[this.charnames[prev]];
    var playerx = currentplayer.x - this.charspacex;
    var playerx = currentplayer.x - this.charspacex + (currentplayer.width / 2) - (character.width / 2);
    var playery = currentplayer.y;
    var destx = this.charspacex;
    this.doCharacterChange("right", destx, playernum, playerx, playery, character, prev);
}

MenuPlayerChooser.prototype.showNextCharacter = function(playernum) {
    if (this.busy[playernum]) return;
    this.busy[playernum] = true;
    fadeOutFast(this.labels[playernum]);
    var current = this.currentchars[playernum];
    var next = (current === this.charnames.length - 1) ?  0 : ++current;

    // todo: find first prev char that isn't in use

    var menu = this;
    var currentplayer = this.players[playernum];
    var character = this.characters[this.charnames[next]];
    var playerx = currentplayer.x + this.charspacex + (currentplayer.width / 2) - (character.width / 2);
    var playery = currentplayer.y;
    var destx = this.charspacex;
    this.doCharacterChange("left", -destx, playernum, playerx, playery, character, next);
}

MenuPlayerChooser.prototype.doCharacterChange = function(dir, destx, playernum, playerx, playery, character, newnum) {
    var player = this.loadPlayer(playerx, playery, character);
    var npc = new NPC(player);
    var menu = this;
    this.npcs[playernum].doAction(dir, true, "x", destx, function() {
        menu.players[playernum + 4] = player;
        menu.npcs[playernum + 4] = npc;
        menu.loop.stage.players[playernum + 4] = player;
        menu.loop.stage.npcs.npcs[playernum + 4] = npc;
        npc.doAction(dir, true, "x", destx, function() { 
            menu.finishCharacterChange(playernum, player, npc, newnum); 
        });
    });
}

MenuPlayerChooser.prototype.finishCharacterChange = function(playernum, player, npc, newnum) {
    this.players[playernum] = player;
    this.npcs[playernum] = npc;
    this.loop.stage.players[playernum] = player;
    this.loop.stage.npcs.npcs[playernum] = npc;
    this.currentchars[playernum] = newnum;
    this.busy[playernum] = false;
    this.showCharacterName(playernum); 
    this.loop.stage.players.splice(playernum + 4, 1);
    this.players.splice(playernum + 4, 1);
    this.loop.stage.npcs.npcs.splice(playernum + 4, 1);
    this.npcs.splice(playernum + 4, 1);
}

MenuPlayerChooser.prototype.showCharacterNames = function() {
    for (var i = 0; i < this.playertotal; i++) this.showCharacterName(i);
}

MenuPlayerChooser.prototype.showCharacterName = function(playernum) {
    if (!this.labels[playernum]) return;
    var p = this.labels[playernum].parentNode;
    var pw = p.offsetWidth;
    var fs = Number(pw / 25);
    if (fs > 15) fs = 15;
    this.labels[playernum].style.fontSize = fs + "px";
    this.labels[playernum].innerHTML =  this.characters[this.charnames[this.currentchars[playernum]]].name;
    fadeInFast(this.labels[playernum]);
}