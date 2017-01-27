"use strict";

function MenuPlayerChooser(gamecontroller, parent, playertotal) {
    this.gamecontroller = gamecontroller;
    this.settings = this.gamecontroller.gamesettings.getSettings(this.gamecontroller.currentview);
    this.input = this.gamecontroller.input;
    this.input.setPlayerChooser(this);
    this.loop = new GameLoop(this.input);
    this.parent = parent;
    this.playertotal = playertotal;
    this.level = this.gamecontroller.gameloader.level;
    this.characters = this.gamecontroller.gameloader.characters;
    this.charnames = Object.keys(this.characters.characters);
    this.animations = this.gamecontroller.gameloader.animations.animations;
    this.chooserui = this.gamecontroller.gameloader.ui;
    this.currentchars = new Array();
    this.currentcharnames = new Array();
    this.labels = new Array();
    this.players = new Array();
    this.playerscustom = new Array();
    this.npcs = new Array();
    this.busy = new Array();
    this.uitimers = new Array();
    this.playerstatus = new Array();
    this.playersready = false;
    this.width = 1200;
    this.height = 800;
    this.scale = 1;
    this.quality = 4;
    this.charspacex = 100;
    this.charspacey = 200;
    this.load();
    return this;
}

MenuPlayerChooser.prototype.menu;

MenuPlayerChooser.prototype.loadSettings = function() { 
    if (!this.settings.players) return;
    for (var i = 0; i < this.playertotal; i++) {
        if (!this.settings.players[i]) continue;
        if (this.settings.players[i].character != null) {
            this.currentchars[i] = this.settings.players[i].character;
            this.currentcharnames[i] = this.settings.players[i].charactername;
        }
        this.playerstatus[i] = {};
        this.playerstatus[i].start = this.settings.players[i].start;
        this.playerstatus[i].ready = this.settings.players[i].ready;
    }
}
    
MenuPlayerChooser.prototype.getSettings = function() { 
    this.settings.players = {};
    for (var i = 0; i < this.playertotal; i++) {
        this.settings.players[i] = {};
        if (this.currentchars[i] != null) {
            this.settings.players[i].character = this.currentchars[i];
            this.settings.players[i].charactername = this.currentcharnames[i];
            if (this.playerstatus[i]) {
                this.settings.players[i].start = this.playerstatus[i].start;
                this.settings.players[i].ready = this.playerstatus[i].ready;
            }
        }
    }
    return this.settings; 
}

MenuPlayerChooser.prototype.load = function() {
    this.loadSettings();
    this.loadLevel();
    this.loadMenuCharacters();
    this.loadChoosers();
    this.loadViews();
}

MenuPlayerChooser.prototype.loadLevel = function() { this.loop.loadLevel(this.level); }

MenuPlayerChooser.prototype.loadMenuCharacters = function() { for (var charname in this.characters.characters) this.loadMenuCharacter(charname); }

MenuPlayerChooser.prototype.loadMenuCharacter = function(charname) {
    var chars = this.characters.characters;
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
    var chars = this.characters.characters;
    var charnames = this.charnames;
    var players = new Players();
    var npcs = new NPCs();
    var keys = Object.keys(this.characters);
    
    for (var i = 0; i < this.playertotal; i++) {

        var charname = "";
        var currentchar = i;
        
        if (this.settings.players && this.settings.players[i]) {
            currentchar = this.settings.players[i].character;
            charname = this.settings.players[i].charactername;
        }
        
        var character = chars[charname];
        
        if (!character) {
            currentchar = 0;
            character = chars[charnames[currentchar]];
            charname = charnames[currentchar];
        }

        if (!character) continue;

        for (var ii = 0; ii < keys.length; ii++) {
            if (keys[ii] == charname) {
                currentchar = ii;
                break;
            }
        }
        
        this.currentchars[i] = currentchar;
        this.currentcharnames[i] = charname;
        
        var mid = this.level.width / 2;
        var playerx = mid - (character.width / 2)   ; 
        
        var playery = 10 + (i * this.charspacey); 
        var player = this.loadPlayer(i, playerx, playery, character);
        
        this.settings.players[i] = player;
        
        players.addPlayer(player);
        this.players[i] = player;
        var npc = new NPC(player);
        npcs.addNPC(npc);
        this.npcs[i] = npc;
    }
    this.loop.loadPlayers(players);
    this.loop.loadNPCs(npcs);
}

MenuPlayerChooser.prototype.loadPlayer = function(id, x, y, character) {
    var pw = character.width ? character.width : 20;
    var ph = character.height ? character.height : 25;
    var pdiff = (20 - pw) / 2;
    pdiff = 0;
    var char = new Character().loadJson(character.json);
    char = this.loadCharacterAnimations(char);
    var speed = 2;
    var player = new Player(id, character.name, "", x + pdiff, y, pw, ph, speed, char);
    player.info.ready = true;
    player.controller.lookThreshold = .1;
    return player;
}

MenuPlayerChooser.prototype.loadViews = function() {
    var views = Array();
    for (var i = 0; i < this.playertotal; i++) views[i] = this.loadView(i);
    this.loop.loadViews(views);
}

MenuPlayerChooser.prototype.loadView = function(i) {
    var w = this.width;
    var h = this.height;
    var s = this.scale;
    var q = this.quality;
    this.loadUI(i);
    return new CharactersView(i + "-ui-player-chooser-canvas", this.playertotal, i, w, h, s, q);
}

MenuPlayerChooser.prototype.loadUI = function(playernum) {
    if (this.chooserui) {
        var div = document.createElement("template");
        var fixed = this.chooserui.replace(/-ui-player-chooser/g, playernum + "-ui-player-chooser");
        div.innerHTML = fixed;
        this.parent.appendChild(div.content.firstChild);
    }
    
    var c = document.getElementById(playernum + "-ui-player-chooser-main");
    var p = 100 / this.playertotal;
    c.style.width = p + "%";
    
    
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
    this.showCharacterNames();
}

MenuPlayerChooser.prototype.showPrevCharacter = function(playernum) {
    if (this.busy[playernum]) return;
    this.busy[playernum] = true;
    
    if (this.uitimers[playernum]) clearTimeout(this.uitimers[playernum]);
    var infotext = document.getElementById(playernum + "-ui-player-chooser-canvas-info-text");
    fadeOutHideFast(infotext);
    
    fadeOutHideFast(this.labels[playernum]);
    var prev = this.getPrevAvaliableCharacter(playernum);
    var currentplayer = this.players[playernum];
    var character = this.characters.characters[this.charnames[prev]];

    var playerx = currentplayer.controller.x - this.charspacex + (currentplayer.controller.width / 2) - (character.width / 2);
    var destx = this.charspacex;
    var playery = 10 + (playernum * this.charspacey);
    
    this.doCharacterChange("right", destx, playernum, playerx, playery, character, prev);
}

MenuPlayerChooser.prototype.showNextCharacter = function(playernum) {
    if (this.busy[playernum]) return;
    this.busy[playernum] = true;
    fadeOutHideFast(this.labels[playernum]);
    
    if (this.uitimers[playernum]) clearTimeout(this.uitimers[playernum]);
    var infotext = document.getElementById(playernum + "-ui-player-chooser-canvas-info-text");
    fadeOutHideFast(infotext);
    
    var nextname = this.getNextAvaliableCharacter(playernum);
    
    var menu = this;
    var currentplayer = this.players[playernum];
    var character = this.characters.characters[this.charnames[nextname]];
    
    var playerx = currentplayer.controller.x + this.charspacex + (currentplayer.controller.width / 2) - (character.width / 2);
    var destx = this.charspacex;
    var playery = 10 + (playernum * this.charspacey);
    
    this.doCharacterChange("left", -destx, playernum, playerx, playery, character, nextname);
}

MenuPlayerChooser.prototype.getPrevAvaliableCharacter = function(playernum) {
    var current = this.currentchars[playernum];
    var prev = (current == 0) ? this.charnames.length - 1 : --current;
    return prev;
}

MenuPlayerChooser.prototype.getNextAvaliableCharacter = function(playernum) {
    var current = this.currentchars[playernum];
    var next = (current === this.charnames.length - 1) ?  0 : ++current;
    return next;
}

MenuPlayerChooser.prototype.doCharacterChange = function(dir, destx, playernum, playerx, playery, character, newnum) {
    var player = this.loadPlayer(playernum, playerx, playery, character);
    var npc = new NPC(player);
    
    this.loop.stage.players.players[playernum + 4] = player;
    this.loop.stage.npcs.npcs[playernum + 4] = npc;
    
    this.npcs[playernum].doAction(dir, true, "x", destx, function() {});

    var menu = this;
    npc.doAction(dir, true, "x", destx, function() { 
        if (npc.player.character.renderer.emitter) {
            npc.player.character.renderer.emitter.stop();
            npc.player.character.renderer.emitter = null;
        }
        menu.finishCharacterChange(playernum, player, npc, newnum); 
    });
}

MenuPlayerChooser.prototype.finishCharacterChange = function(playernum, player, npc, newnum) {
    this.players[playernum] = player;
    this.npcs[playernum] = npc;
    this.loop.stage.players.players[playernum] = player;
    this.loop.stage.npcs.npcs[playernum] = npc;

    this.currentchars[playernum] = newnum;
    
    this.settings.players[playernum].character = newnum;

    var newname = this.charnames[newnum];
    this.currentcharnames[playernum] = newname;
    this.settings.players[playernum].charactername = newname;
    
    this.busy[playernum] = false;
    this.showCharacterName(playernum); 
    this.loop.stage.players.players[playernum + 4] = null;
    this.loop.stage.npcs.npcs[playernum + 4] = null;
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
    
    if (this.players[playernum] && this.players[playernum].character) {
        this.labels[playernum].innerHTML =  this.players[playernum].character.name;    
    } 
    
    fadeInFast(this.labels[playernum]);
}

MenuPlayerChooser.prototype.startGame = function() {
    var b = document.getElementById("start-game");
    window.location = b.href;
}
