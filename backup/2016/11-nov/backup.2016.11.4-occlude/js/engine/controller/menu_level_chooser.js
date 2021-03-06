"use strict";

function MenuLevelChooser(gamecontroller, parent) {
    
    this.gamecontroller = gamecontroller;
    
    this.settings = this.gamecontroller.gamesettings.getSettings(this.gamecontroller.currentview);
    
    this.input = this.gamecontroller.input;
    this.input.setLevelChooser(this);
    
    this.loop = new GameLoop(this.input);
    
    this.parent = parent;
    this.loader = this.gamecontroller.gameloader;
    this.levels = this.loader.levels;
    this.levelkeys = Object.keys(this.levels);
    this.items = this.loader.items;
    this.started = false;
    this.chooserui = this.loader.ui;
    this.loadedlevels = new Array();
    this.canvasid = "ui-level-chooser-canvas";
    this.canvasswapid = "ui-level-chooser-canvas-swap";
    this.currentlevel = 0;
    this.levelname = "";
    this.leveltitle = "";
    this.level = null;
    this.swaplevel = null;
    this.view = null;
    this.viewswap = null;
    this.busy = false;
    
    this.width = 100;
    this.height = 100;
    this.fov = 10;
    this.scale = 0;
    this.levelquality = 1;
    this.playerquality = 1;
    this.device = "";
    this.gamequality = new GameQuality(this, 1);
    setFOV(600);

    this.loadSettings();
    this.load();
    return this;
}

MenuLevelChooser.prototype.loadSettings = function() { 
    if (!this.settings.levelname) return;
    this.levelname = this.settings.levelname;
}
    
MenuLevelChooser.prototype.getSettings = function() { 
    this.settings.levelname = this.levelname;
    this.settings.level = this.levelname;
    return this.settings; 
}

MenuLevelChooser.prototype.load = function() {
    if (!this.levels[this.levelname]) this.levelname = "";
    if (this.levelname) this.loadLevel(this.levelname, this.levels[this.levelname], this.canvasid);
    else this.loadLevel(this.levelkeys[this.currentlevel], this.levels[this.levelkeys[this.currentlevel]], this.canvasid);
}

MenuLevelChooser.prototype.loadLevel = function(levelname, level, canvasid, callback) { 
    var menu = this;
    this.loader.loadLevelFile(level.file, function() {
        if (callback) {
            callback();
            return;
        }
        menu.level = menu.loader.level;
        menu.loadedlevels[levelname] = menu.level;
        menu.currentlevel = menu.levelkeys.indexOf(levelname);
        
        menu.leveltitle = menu.loader.levels[levelname].name;
        
        var themes = menu.loader.levels[levelname].themes;
        if (themes) {
            var themkeys = Object.keys(themes);
            for (var i = 0; i < themkeys.length; i++) {
                var themename = themes[themkeys[i]];
                menu.level.loadTheme(themename, menu.loader.themes.themes[themename], menu.loader.materials);
            }
        }

        menu.loop.loadLevel(menu.level);
        menu.loadView(menu.view, canvasid);
        menu.loop.resize();
        if (!menu.running && menu.started) menu.start();
    });
}

MenuLevelChooser.prototype.loadView = function(view, canvasid) {
    this.loop.hideViews();
    this.loadUI();
    
    var w = this.width;
    var h = this.height;
    var s = this.scale;
    var lq = this.levelquality;
    var pq = this.playerquality;
    
    view = new LevelView(canvasid, w, h, s, lq, pq);
    this.loop.loadViews(new Array(view));
}

MenuLevelChooser.prototype.loadUI = function() {

    var div = document.createElement("template");
    var ui = this.chooserui;
    div.innerHTML = ui;

    var foo = div.firstChild;
    if (!foo) foo = div.content.firstChild;
    if (foo) this.parent.appendChild(foo);
    
    this.label = document.getElementById("ui-level-chooser-canvas-text");
    fadeOutHideFast(this.label);
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
    }
    fadeIn(document.getElementById("ui-level-chooser-main"));
}

MenuLevelChooser.prototype.start = function() {
    this.started = true;
    if (!this.level) return;
    this.loop.start();
    this.loop.showViews();
    this.showLevelName();
    this.running = true;
}

MenuLevelChooser.prototype.stop = function() {
    this.loop.stop();
    this.started = false;
    this.running = false;
}

MenuLevelChooser.prototype.resize = function() {
    this.loop.resize();
    this.showLevelName();
}

MenuLevelChooser.prototype.showPrevLevel = function() {
    if (this.busy) return;
    this.busy = true;
    fadeOutHideFast(this.label);
    var prev = this.getPrevAvaliableLevel();
    var menu = this;
    var canvas = document.getElementById(this.canvasid);
    var newcanvas = this.cloneLevel(canvas, "level-next");
    var swaplevelname = this.levelkeys[prev];
    if (this.loadedlevels[swaplevelname]) {
        this.swaplevel = this.loadedlevels[swaplevelname];
        this.doLevelSwap(swaplevelname);
        fadeInFast(newcanvas);
        canvas.className += " level-prev";
        newcanvas.className = newcanvas.className.replace(/level-next/g, '');
        setTimeout(function() { menu.finishLevelSwap(prev) }, 2000);
        return;
    }
    var swaplevel = this.levels[swaplevelname];
    this.loadLevel(swaplevelname, swaplevel, null, function() {
        menu.swaplevel = menu.loader.level;
        menu.doLevelSwap(swaplevelname);
        fadeInFast(newcanvas);
        canvas.className += " level-prev";
        newcanvas.className = newcanvas.className.replace(/level-next/g, '');
        setTimeout(function() { menu.finishLevelSwap(prev) }, 2000);
    });
}

MenuLevelChooser.prototype.showNextLevel = function(playernum) {
    if (this.busy) return;
    this.busy = true;
    fadeOutHideFast(this.label);
    var next = this.getNextAvaliableLevel();
    var menu = this;
    var canvas = document.getElementById(this.canvasid);
    var newcanvas = this.cloneLevel(canvas, "level-prev");
    var swaplevelname = this.levelkeys[next];
    if (this.loadedlevels[swaplevelname]) {
        this.swaplevel = this.loadedlevels[swaplevelname];
        this.doLevelSwap(swaplevelname);
        fadeInFast(newcanvas);
        canvas.className += " level-next";
        newcanvas.className = newcanvas.className.replace(/level-prev/g, '');
        setTimeout(function() { menu.finishLevelSwap(next) }, 2000);
        return;
    }
    var swaplevel = this.levels[swaplevelname];
    this.loadLevel(swaplevelname, swaplevel, null, function() {
        menu.swaplevel = menu.loader.level;
        menu.doLevelSwap(swaplevelname);
        fadeInFast(newcanvas);
        canvas.className += " level-next";
        newcanvas.className = newcanvas.className.replace(/level-prev/g, '');
        setTimeout(function() { menu.finishLevelSwap(next) }, 2000);
    });
}

MenuLevelChooser.prototype.cloneLevel = function(canvas, classname) {
    var newcanvas = canvas.cloneNode();
    newcanvas.id = this.canvasswapid;
    newcanvas.className += " absolute " + classname;
    newcanvas.className = newcanvas.className.replace(/bg-color-white/g, '');
    newcanvas.style.top = canvas.style.top;
    canvas.parentNode.appendChild(newcanvas);
    return newcanvas;
}

MenuLevelChooser.prototype.doLevelSwap = function(swaplevelname) {
    this.loop.stop();
    this.loadedlevels[swaplevelname] = this.swaplevel;

    this.leveltitle = this.loader.levels[swaplevelname].name;
    
    var themes = this.loader.levels[swaplevelname].themes;
    if (themes) {
        this.swaplevel.itemrenderer.theme = null;
        var themkeys = Object.keys(themes);
        for (var i = 0; i < themkeys.length; i++) {
            var themename = themes[themkeys[i]];
            this.swaplevel.loadTheme(themename, this.loader.themes.themes[themename], this.loader.materials);
        }
    }
    
    this.loop.loadLevel(this.swaplevel);
    
    var w = this.width;
    var h = this.height;
    var s = this.scale;
    
    this.viewswap = new LevelView(this.canvasswapid, w, h, s);
    this.loop.loadViews(new Array(this.viewswap));
    this.loop.resize();
    
    this.loop.start();
    this.loop.showViews();
}

MenuLevelChooser.prototype.finishLevelSwap = function(newcurrent) {
    this.levelname = this.levelkeys[newcurrent];
    this.level = this.swaplevel;
    this.currentlevel = newcurrent;
    this.view = this.viewswap;
    var canvas = document.getElementById(this.canvasid);
    canvas.parentNode.removeChild(canvas);
    var newcanvas = document.getElementById(this.canvasswapid);
    newcanvas.id = this.canvasid;
    this.busy = false;
    this.showLevelName();
}
    
MenuLevelChooser.prototype.getPrevAvaliableLevel = function() {
    return (this.currentlevel == 0) ? this.levelkeys.length -1 : --this.currentlevel;   
}

MenuLevelChooser.prototype.getNextAvaliableLevel = function() {
    return (this.currentlevel == this.levelkeys.length - 1) ? 0 : ++this.currentlevel;   
}

MenuLevelChooser.prototype.showLevelName = function() {
    if (this.level && this.label) {
        this.label.innerHTML = this.leveltitle;
        fadeInFast(this.label);
    }
}

MenuLevelChooser.prototype.startGame = function() {
    var b = document.getElementById("start-game");
    window.location = b.href;
}

