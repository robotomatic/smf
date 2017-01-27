function MenuLevelChooser(loader, parent, devtools, settings) {
    this.menu = new Menu(devtools, settings);
    this.loop = new GameLoop(devtools);
    this.parent = parent;

    this.loader = loader;
    this.levels = this.loader.levels;
    this.items = this.loader.items;
    
    this.chooserui = this.loader.ui;

    this.settings = settings;
    
    this.busy = false;
    this.load();
    return this;
}

MenuLevelChooser.prototype.menu;

MenuLevelChooser.prototype.getSettings = function() { return this.settings; }

MenuLevelChooser.prototype.load = function() {
    this.loadLevels();
    this.loadView();
}

MenuLevelChooser.prototype.loadLevels = function() {
    for (var i = 0; i < this.levels.length; i++) this.loadLevel(this.levels[i]);
}


MenuLevelChooser.prototype.loadLevel = function() { 
    //this.loop.loadLevel(this.level); 
}


MenuLevelChooser.prototype.loadView = function(i) {
//    var vx = (this.level.width / 2) - 9;
//    var vy = this.charspacey * (i + 1);
//    var menubox = {
//        "x" : vx,
//        "y" : vy  + 5,
//        "width" : 20,
//        "height" : 25
//    }
//    this.loop.hideViews();
//    var z = 15;
//    var w = 1200, h = 600;
//    
    this.loadUI();
//    return new LevelView("ui-level-chooser-canvas", i, menubox, w, h, z);
}

MenuLevelChooser.prototype.loadUI = function() {
    var div = document.createElement("div");
    var ui = this.chooserui;
    div.innerHTML = ui;
    this.parent.appendChild(div);
    resize();
    
//    document.getElementById(playernum + "-ui-player-chooser-title").innerHTML = "PLAYER " + (playernum + 1);
//    document.getElementById(playernum + "-ui-player-chooser-custom-title").innerHTML = "PLAYER " + (playernum + 1);
//    this.labels[playernum] = document.getElementById(playernum + "-ui-player-chooser-canvas-text");
    
    var menu = this;

    var prev = document.getElementById("ui-level-chooser-button-prev");
    if (prev) {
        prev.onclick = function(e) {
            menu.showPrevLevel();
            e.preventDefault();
            return false;
        }
    }
    var next = document.getElementById("ui-level-chooser-button-next");
    if (next) {
        next.onclick = function(e) {
            menu.showNextLevel();
            e.preventDefault();
            return false;
        }
    }
    var card = document.getElementById("ui-level-chooser-card");
    var custom = document.getElementById("ui-level-chooser-button-custom");
    if (custom) {
        custom.onclick = function(e) {
            card.className += " flipped";
            e.preventDefault();
            return false;
        }
        var customok = document.getElementById("ui-level-chooser-custom-button-ok");
        customok.onclick = function(e) {
            // todo: custom stuff
            card.className = card.className.replace(/flipped/g, '');
            e.preventDefault();
            return false;
        }
    }
    fadeIn(document.getElementById("ui-level-chooser-main"));
}

MenuLevelChooser.prototype.start = function() {
    this.showLevelName();
    this.loop.start();
    this.loop.showViews();
    this.running = true;
}

MenuLevelChooser.prototype.stop = function() {
    this.loop.stop();
    this.running = false;
}

MenuLevelChooser.prototype.resize = function() {
    this.loop.resize();
    this.menu.resize();
    this.showLevelName();
}

MenuLevelChooser.prototype.showPrevLevel = function(playernum) {
//    if (this.busy[playernum]) return;
//    this.busy[playernum] = true;
//    fadeOutHideFast(this.labels[playernum]);
//    var prev = this.getPrevAvaliableCharacter(playernum);
//    var currentplayer = this.players[playernum];
//    var character = this.characters[this.charnames[prev]];
//    var playerx = currentplayer.x - this.charspacex;
//    var playerx = currentplayer.x - this.charspacex + (currentplayer.width / 2) - (character.width / 2);
//    var playery = currentplayer.y;
//    var destx = this.charspacex;
//    this.doCharacterChange("right", destx, playernum, playerx, playery, character, prev);
}

MenuLevelChooser.prototype.showNextLevel = function(playernum) {
//    if (this.busy[playernum]) return;
//    this.busy[playernum] = true;
//    fadeOutHideFast(this.labels[playernum]);
//    var next = this.getNextAvaliableCharacter(playernum);
//    var menu = this;
//    var currentplayer = this.players[playernum];
//    var character = this.characters[this.charnames[next]];
//    var playerx = currentplayer.x + this.charspacex + (currentplayer.width / 2) - (character.width / 2);
//    var playery = currentplayer.y;
//    var destx = this.charspacex;
//    this.doCharacterChange("left", -destx, playernum, playerx, playery, character, next);
}

MenuLevelChooser.prototype.getPrevAvaliableLevel = function(playernum) {
//    var current = this.currentchars[playernum];
//    var prev = (current == 0) ? this.charnames.length - 1 : --current;
//    return prev;
}

MenuLevelChooser.prototype.getNextAvaliableLevel = function(playernum, next) {
//    var current = this.currentchars[playernum];
//    var next = (current === this.charnames.length - 1) ?  0 : ++current;
//    return next;
}

MenuLevelChooser.prototype.doLevelChange = function(dir, destx, playernum, playerx, playery, character, newnum) {
//    var player = this.loadPlayer(playerx, playery, character);
//    var npc = new NPC(player);
//    var menu = this;
//    this.npcs[playernum].doAction(dir, true, "x", destx, function() {
//        menu.players[playernum + 4] = player;
//        menu.npcs[playernum + 4] = npc;
//        menu.loop.stage.players[playernum + 4] = player;
//        menu.loop.stage.npcs.npcs[playernum + 4] = npc;
//        npc.doAction(dir, true, "x", destx, function() { 
//            menu.finishCharacterChange(playernum, player, npc, newnum); 
//        });
//    });
}

MenuLevelChooser.prototype.finishLevelChange = function(playernum, player, npc, newnum) {
//    this.players[playernum] = player;
//    this.npcs[playernum] = npc;
//    this.loop.stage.players[playernum] = player;
//    this.loop.stage.npcs.npcs[playernum] = npc;
//    this.currentchars[playernum] = newnum;
//    this.busy[playernum] = false;
//    this.showCharacterName(playernum); 
//    this.loop.stage.players.splice(playernum + 4, 1);
//    this.players.splice(playernum + 4, 1);
//    this.loop.stage.npcs.npcs.splice(playernum + 4, 1);
//    this.npcs.splice(playernum + 4, 1);
}

MenuLevelChooser.prototype.showLevelName = function(playernum) {
//    if (!this.labels[playernum]) return;
//    var p = this.labels[playernum].parentNode;
//    var pw = p.offsetWidth;
//    var fs = Number(pw / 25);
//    if (fs > 15) fs = 15;
//    this.labels[playernum].style.fontSize = fs + "px";
//    this.labels[playernum].innerHTML =  this.characters[this.charnames[this.currentchars[playernum]]].name;
//    fadeInFast(this.labels[playernum]);
}