"use strict";

function MenuPlayerChooser(gamecontroller, parent, playertotal) {
    
    this.gamecontroller = gamecontroller;
    
    this.devtools = gamecontroller.devtools;
    this.settings = this.gamecontroller.gamesettings.getSettings(this.gamecontroller.currentview);
    
    this.input = this.gamecontroller.input;
    this.input.setPlayerChooser(this);
    this.menu = new Menu(this.gamecontroller.input, this.devtools, this.settings);
    this.loop = new GameLoop(this.input, this.devtools);
    this.parent = parent;
    this.charspacex = 55;
    this.charspacey = 200;
    this.playertotal = playertotal;
    this.level = this.gamecontroller.gameloader.level;
    this.characters = this.gamecontroller.gameloader.characters;
    this.charnames = Object.keys(this.characters);
    this.animations = this.gamecontroller.gameloader.animations;
    this.chooserui = this.gamecontroller.gameloader.ui;
    this.currentchars = new Array();
    this.labels = new Array();
    this.players = new Array();
    this.playerscustom = new Array();
    this.npcs = new Array();
    this.busy = new Array();
    this.uitimers = new Array();
    this.playerstatus = new Array();
    this.playersready = false;
    this.load();
    return this;
}

MenuPlayerChooser.prototype.menu;

MenuPlayerChooser.prototype.loadSettings = function() { 
    if (!this.settings.players) return;
    for (let i = 0; i < this.playertotal; i++) {
        if (!this.settings.players[i]) continue;
        if (this.settings.players[i].character != null) this.currentchars[i] = this.settings.players[i].character;
        if (this.settings.players[i]) {
            this.playerstatus[i] = {};
            this.playerstatus[i].start = this.settings.players[i].start;
            this.playerstatus[i].ready = this.settings.players[i].ready;
        }
        this.updatePlayerStatus(i);
    }
    this.updateMainUI();
}
    
MenuPlayerChooser.prototype.getSettings = function() { 
    this.settings.players = {};
    for (let i = 0; i < this.playertotal; i++) {
        this.settings.players[i] = {};
        if (this.currentchars[i] != null) this.settings.players[i].character = this.currentchars[i];
        if (this.playerstatus[i]) {
            this.settings.players[i].start = this.playerstatus[i].start;
            this.settings.players[i].ready = this.playerstatus[i].ready;
        }
    }
    return this.settings; 
}

MenuPlayerChooser.prototype.load = function() {
    this.loadLevel();
    
    this.loadMenuCharacters();
    
    this.loadChoosers();
    this.loadViews();
    this.loadSettings();
}

MenuPlayerChooser.prototype.loadLevel = function() { this.loop.loadLevel(this.level); }

MenuPlayerChooser.prototype.loadMenuCharacters = function() { for (let charname in this.characters) this.loadMenuCharacter(charname); }

MenuPlayerChooser.prototype.loadMenuCharacter = function(charname) {
    let chars = this.characters;
    let character = chars[charname];
    this.loadCharacterAnimations(character);
}
    
MenuPlayerChooser.prototype.loadCharacterAnimations = function(character) {
    let charanims = new Array();
    for (let a in character.animations) charanims[character.animations[a]] = this.animations[character.animations[a]];
    character.setAnimator(new CharacterAnimator(charanims));
    character.setRenderer(new CharacterRenderer());
    return character;
}
    
MenuPlayerChooser.prototype.loadChoosers = function() {
    let chars = this.characters;
    let charnames = this.charnames;
    let players = new Players();
    let npcs = new NPCs();
    for (let i = 0; i < this.playertotal; i++) {
        let currentchar = i;
        if (this.settings.players && this.settings.players[i] && this.settings.players[i].character) currentchar = this.settings.players[i].character;
        let character = chars[charnames[currentchar]];
        
        if (!character) {
            currentchar = 0;
            character = chars[charnames[currentchar]];
        }
        
        this.currentchars[i] = currentchar;
        let mid = this.level.width / 2;
        let playerx = mid - (character.width / 2); 
        let playery = 10 + (i * this.charspacey); 
        let player = this.loadPlayer(i, playerx, playery, character);
        players.addPlayer(player);
        this.players[i] = player;
        let npc = new NPC(player);
        npcs.addNPC(npc);
        this.npcs[i] = npc;
    }
    this.loop.loadPlayers(players.getPlayers());
    this.loop.loadNPCs(npcs);
}

MenuPlayerChooser.prototype.loadPlayer = function(id, x, y, character) {
    let pw = character.width ? character.width : 20;
    let ph = character.height ? character.height : 25;
    let pdiff = (20 - pw) / 2;
    pdiff = 0;
    let char = new Character().loadJson(character.json);
    char = this.loadCharacterAnimations(char);
    let player = new Player(id, character.name, "", x + pdiff, y, pw, ph, 1, char);
    player.ready = true;
    player.lookThreshold = .1;
    return player;
}

MenuPlayerChooser.prototype.loadViews = function() {
    let views = Array();
    for (let i = 0; i < this.playertotal; i++) views[i] = this.loadView(i);
    this.loop.loadViews(views);
}

MenuPlayerChooser.prototype.loadView = function(i) {
    let vx = (this.level.width / 2) - 9;
    let vy = this.charspacey * (i + 1);
    let menubox = {
        "x" : vx - .8,
        "y" : vy - 8,
        "width" : 20,
        "height" : 25
    }
    this.loop.hideViews();
    let z = 15;
    let w = 1200, h = 600;
    
    this.loadUI(i);
    return new CharactersView(i + "-ui-player-chooser-canvas", i, menubox, w, h, z);
}

MenuPlayerChooser.prototype.loadUI = function(playernum) {

    if (this.chooserui) {
        let div = document.createElement("div");
        let fixed = this.chooserui.replace(/-ui-player-chooser/g, playernum + "-ui-player-chooser");
        div.innerHTML = fixed;
        this.parent.appendChild(div);
    }
    
    //resize();
    
    document.getElementById(playernum + "-ui-player-chooser-title").innerHTML = "PLAYER " + (playernum + 1);
    this.labels[playernum] = document.getElementById(playernum + "-ui-player-chooser-canvas-text");
    let card = document.getElementById(playernum + "-ui-player-chooser-custom-card");
    let menu = this;
    let start = document.getElementById(playernum + "-ui-player-chooser-button-start");
    if (start) {
        start.onclick = function(e) {
            if (menu.playerstatus[playernum]) {
                if (menu.playerstatus[playernum].custom == true) {
                    card.className = card.className.replace(/flipped/g, '');
                    menu.playerstatus[playernum].custom = false;
                } else if (menu.playerstatus[playernum].start) {
                    if (menu.playerstatus[playernum].ready) menu.playerstatus[playernum].ready = false;
                    else menu.playerstatus[playernum].ready = true;
                } else menu.playerstatus[playernum] = { start : true, ready : false };
            }
            menu.updatePlayerStatus(playernum);
            menu.updateMainUI();
            e.preventDefault();
            return false;
        }
    }
    let exit = document.getElementById(playernum + "-ui-player-chooser-button-close");
    if (exit) {
        exit.onclick = function(e) {
            let card = document.getElementById(playernum + "-ui-player-chooser-custom-card");
            setTimeout(function() {
                card.className = card.className.replace(/flipped/g, '');
            }, 500);
            menu.playerstatus[playernum] = { ready : false, start : false, custom : false };
            menu.updatePlayerStatus(playernum);
            menu.updateMainUI();
            e.preventDefault();
            return false;
        }
    }
    let prev = document.getElementById(playernum + "-ui-player-chooser-button-prev");
    if (prev) {
        prev.onclick = function(e) {
            menu.showPrevCharacter(playernum);
            e.preventDefault();
            return false;
        }
    }
    let next = document.getElementById(playernum + "-ui-player-chooser-button-next");
    if (next) {
        next.onclick = function(e) {
            menu.showNextCharacter(playernum);
            e.preventDefault();
            return false;
        }
    }
    let custom = document.getElementById(playernum + "-ui-player-chooser-button-custom");
    if (custom) {
        custom.onclick = function(e) {
            menu.playerscustom[playernum] = true;
            card.className += " flipped";
            menu.playerstatus[playernum].custom = true;
            let button = document.getElementById(playernum + "-ui-player-chooser-button-start");
            button.innerHTML = "OK";
            e.preventDefault();
            return false;
        }
    }
//    let next = document.getElementById("start-game");
//    next.onclick = function(e) {
//        if (!menu.playersready) {
//            //  todo: wiggle offenders
//            e.preventDefault();
//            return false;
//        }
//    }
    this.updateMainUI();
    fadeIn(document.getElementById("ui-player-chooser-main"));
}

MenuPlayerChooser.prototype.updateMainUI = function(playernum) {
    let players = false;
    let ready = true;
    for (let i = 0; i < this.playertotal; i++) {
        if (this.playerstatus[i]) {
            if (this.playerstatus[i].start == true) {
                players = true;
                if (this.playerstatus[i].ready == false) {
                    ready = false;                
                    break;
                }
            }
        }
    }
    if (!players) ready = false;
    this.playersready = ready;
    let button = document.getElementById("main-content-game-button");
    let icon = document.getElementById("main-content-game-button-disable");
    let label = document.getElementById("start-game");
//    if (ready) { 
//        button.className = button.className.replace(/button-disabled/g, '');
//        if (button.className.indexOf("bg-color-ok") == -1) button.className += " bg-color-ok";
//        fadeOutHide(icon);    
//        label.className = label.className.replace(/button-label-disabled/g, '');
//    } else {
//        button.className = button.className.replace(/bg-color-ok/g, '');
//        button.className += " button-disabled";
//        clearFade(icon);
//        label.className += " button-label-disabled";
//    }
}

MenuPlayerChooser.prototype.updatePlayerStatus = function(playernum) {
    if (!this.playerstatus[playernum]) this.playerstatus[playernum] = { ready : false, start : false, custom : false };
    if (this.playerstatus[playernum].start && this.playerstatus[playernum].ready) {
        this.openPlayerChooser(playernum);
        this.playerReady(playernum);
    } else if (this.playerstatus[playernum].start && !this.playerstatus[playernum].ready) {
        this.openPlayerChooser(playernum);
        this.playerNotReady(playernum);
    } else {
        this.closePlayerChooser(playernum);
        this.playerReady(playernum);
    }
}

MenuPlayerChooser.prototype.openPlayerChooser = function(playernum) {
    // todo: can use 1-classname here
    let head = document.getElementById(playernum + "-ui-player-chooser-head");
    head.className = head.className.replace(/closed/g, '');
    let infotext = document.getElementById(playernum + "-ui-player-chooser-canvas-info-text");
    fadeOutHideFast(infotext);
    let title = document.getElementById(playernum + "-ui-player-chooser-title");
    title.className = title.className.replace(/closed/g, '');
    let body = document.getElementById(playernum + "-ui-player-chooser-body");
    body.className = body.className.replace(/closed/g, '');
    fadeInFast(body);
    let foot = document.getElementById(playernum + "-ui-player-chooser-foot");
    foot.className = foot.className.replace(/closed/g, '');
    let link = document.getElementById(playernum + "-ui-player-chooser-button-start");
    fadeOut(link);
    link.innerHTML="READY";
    fadeIn(link);
}

MenuPlayerChooser.prototype.closePlayerChooser = function(playernum) {
    // todo: can use 1-classname here
    let head = document.getElementById(playernum + "-ui-player-chooser-head");
    head.className += " closed";
    let infotext = document.getElementById(playernum + "-ui-player-chooser-canvas-info-text");
    fadeOutHideFast(infotext);
    let title = document.getElementById(playernum + "-ui-player-chooser-title");
    title.className  += " closed";
    let body = document.getElementById(playernum + "-ui-player-chooser-body");
    body.className  += " closed";
    setTimeout(function() { fadeOutHideFast(body); }, 1000);
    let foot = document.getElementById(playernum + "-ui-player-chooser-foot");
    foot.className  += " closed";
    let link = document.getElementById(playernum + "-ui-player-chooser-button-start");
    fadeOut(link);
    link.innerHTML="START";
    fadeIn(link);
}

MenuPlayerChooser.prototype.playerReady = function(playernum) {
    let infotext = document.getElementById(playernum + "-ui-player-chooser-canvas-info-text");
    fadeOutHideFast(infotext);
    let custom = document.getElementById(playernum + "-ui-player-chooser-button-custom");
    fadeOutHide(custom);
    let prev = document.getElementById(playernum + "-ui-player-chooser-button-prev");
    fadeOutHide(prev);
    let next = document.getElementById(playernum + "-ui-player-chooser-button-next");
    fadeOutHide(next);
    let button = document.getElementById(playernum + "-ui-player-chooser-button-start-button");
    button.className += " bg-color-ok";
}

MenuPlayerChooser.prototype.playerNotReady = function(playernum) {
    this.showInfoText(playernum);
    let custom = document.getElementById(playernum + "-ui-player-chooser-button-custom");
    fadeIn(custom);
    let prev = document.getElementById(playernum + "-ui-player-chooser-button-prev");
    fadeIn(prev);
    let next = document.getElementById(playernum + "-ui-player-chooser-button-next");
    fadeIn(next);
    let button = document.getElementById(playernum + "-ui-player-chooser-button-start-button");
    button.className = button.className.replace(/bg-color-ok/g, '');
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
    
    if (this.uitimers[playernum]) clearTimeout(this.uitimers[playernum]);
    let infotext = document.getElementById(playernum + "-ui-player-chooser-canvas-info-text");
    fadeOutHideFast(infotext);
    
    fadeOutHideFast(this.labels[playernum]);
    let prev = this.getPrevAvaliableCharacter(playernum);
    let currentplayer = this.players[playernum];
    let character = this.characters[this.charnames[prev]];
//    let playerx = currentplayer.x - this.charspacex;
    let playerx = currentplayer.x - this.charspacex + (currentplayer.width / 2) - (character.width / 2);
    let playery = currentplayer.y - 20;
    let destx = this.charspacex;
    this.doCharacterChange("right", destx, playernum, playerx, playery, character, prev);
}

MenuPlayerChooser.prototype.showNextCharacter = function(playernum) {
    if (this.busy[playernum]) return;
    this.busy[playernum] = true;
    fadeOutHideFast(this.labels[playernum]);
    
    if (this.uitimers[playernum]) clearTimeout(this.uitimers[playernum]);
    let infotext = document.getElementById(playernum + "-ui-player-chooser-canvas-info-text");
    fadeOutHideFast(infotext);
    
    let nextname = this.getNextAvaliableCharacter(playernum);
    
    let menu = this;
    let currentplayer = this.players[playernum];
    let character = this.characters[this.charnames[nextname]];
    let playerx = currentplayer.x + this.charspacex + (currentplayer.width / 2) - (character.width / 2);
    let playery = currentplayer.y - 20;
    let destx = this.charspacex;
    this.doCharacterChange("left", -destx, playernum, playerx, playery, character, nextname);
}

MenuPlayerChooser.prototype.getPrevAvaliableCharacter = function(playernum) {
    let current = this.currentchars[playernum];
    let prev = (current == 0) ? this.charnames.length - 1 : --current;
    return prev;
}

MenuPlayerChooser.prototype.getNextAvaliableCharacter = function(playernum) {
    let current = this.currentchars[playernum];
    let next = (current === this.charnames.length - 1) ?  0 : ++current;
    return next;
}

MenuPlayerChooser.prototype.doCharacterChange = function(dir, destx, playernum, playerx, playery, character, newnum) {
    let player = this.loadPlayer(playernum, playerx, playery, character);
    let npc = new NPC(player);
    let menu = this;
    this.npcs[playernum].doAction(dir, true, "x", destx, function() {
        menu.players[playernum + 4] = player;
        menu.npcs[playernum + 4] = npc;
        menu.loop.stage.players[playernum + 4] = player;
        menu.loop.stage.npcs.npcs[playernum + 4] = npc;
        npc.doAction(dir, true, "x", destx, function() { 
            if (npc.player.character.renderer.emitter) {
                npc.player.character.renderer.emitter.stop();
                npc.player.character.renderer.emitter = null;
            }
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
    this.settings.players[playernum].character = newnum;
    this.busy[playernum] = false;
    this.showCharacterName(playernum); 
    this.loop.stage.players.splice(playernum + 4, 1);
    this.players.splice(playernum + 4, 1);
    this.loop.stage.npcs.npcs.splice(playernum + 4, 1);
    this.npcs.splice(playernum + 4, 1);
    this.showInfoText(playernum);
}

MenuPlayerChooser.prototype.showCharacterNames = function() {
    for (let i = 0; i < this.playertotal; i++) this.showCharacterName(i);
}

MenuPlayerChooser.prototype.showInfoText = function(playernum) {
//    if (this.uitimers[playernum]) clearTimeout(this.uitimers[playernum]);
//    
////    if (this.playerscustom[playernum]) return;
//    
//    let infotext = document.getElementById(playernum + "-ui-player-chooser-canvas-info-text");
//    this.uitimers[playernum] = setTimeout(function() { fadeIn(infotext); }, 2000);
}

MenuPlayerChooser.prototype.showCharacterName = function(playernum) {
    if (!this.labels[playernum]) return;
    let p = this.labels[playernum].parentNode;
    let pw = p.offsetWidth;
    let fs = Number(pw / 25);
    if (fs > 15) fs = 15;
    this.labels[playernum].style.fontSize = fs + "px";
//    this.labels[playernum].innerHTML =  this.characters[this.charnames[this.currentchars[playernum]]].name;
    
    this.labels[playernum].innerHTML =  this.players[playernum].character.name;
    fadeInFast(this.labels[playernum]);
}

MenuPlayerChooser.prototype.startGame = function() {
    let b = document.getElementById("start-game");
    window.location = b.href;
}
