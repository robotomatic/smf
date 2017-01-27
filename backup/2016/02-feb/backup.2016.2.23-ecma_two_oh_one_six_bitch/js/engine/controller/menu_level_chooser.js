"use strict";

function MenuLevelChooser(gamecontroller, parent) {
    
    this.gamecontroller = gamecontroller;
    
    this.devtools = this.gamecontroller.devtools;
    this.settings = this.gamecontroller.gamesettings.getSettings(this.gamecontroller.currentview);
    
    this.input = this.gamecontroller.input;
    this.input.setLevelChooser(this);
    this.menu = new Menu(this.devtools, this.settings);
    this.loop = new GameLoop(this.input, this.devtools);
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
    this.level = null;
    this.swaplevel = null;
    this.view = null;
    this.viewswap = null;
    this.busy = false;
    this.loadSettings();
    this.load();
    return this;
}

MenuLevelChooser.prototype.menu;

MenuLevelChooser.prototype.loadSettings = function() { 
    if (!this.settings.levelname) return;
    this.levelname = this.settings.levelname;
}
    
MenuLevelChooser.prototype.getSettings = function() { 
    this.settings.levelname = this.levelname;
    this.settings.level = this.level;
    return this.settings; 
}

MenuLevelChooser.prototype.load = function() {
    if (this.levelname) this.loadLevel(this.levelname, this.levels[this.levelname], this.canvasid);
    else this.loadLevel(this.levelkeys[this.currentlevel], this.levels[this.levelkeys[this.currentlevel]], this.canvasid);
//    let button = document.getElementById("main-content-game-button");
//    button.className = button.className.replace(/button-disabled/g, '');
//    if (button.className.indexOf("bg-color-ok") == -1) button.className += " bg-color-ok";
}

MenuLevelChooser.prototype.loadLevel = function(levelname, level, canvasid, callback) { 
    let menu = this;
    this.loader.loadLevelFile(level.file, function() {
        if (callback) {
            callback();
            return;
        }
        menu.level = menu.loader.level;
        menu.loadedlevels[levelname] = menu.level;
        menu.currentlevel = menu.levelkeys.indexOf(levelname);
        menu.level.setTheme(menu.loader.themes[menu.level.theme]);
        menu.loop.loadLevel(menu.level);
        menu.loadView(menu.view, canvasid);
        menu.loop.resize();
        if (!menu.running && menu.started) menu.start();
    });
}

MenuLevelChooser.prototype.loadView = function(view, canvasid) {
    this.loop.hideViews();
    this.loadUI();
    view = new LevelView(canvasid);
    this.loop.loadViews(new Array(view));
}

MenuLevelChooser.prototype.loadUI = function() {
    let div = document.createElement("div");
    let ui = this.chooserui;
    div.innerHTML = ui;
    this.parent.appendChild(div);
    
    resizeElements();
    
    this.label = document.getElementById("ui-level-chooser-canvas-text");
    fadeOutHideFast(this.label);
    let menu = this;
    let prev = document.getElementById("ui-level-chooser-button-prev");
    if (prev) {
        prev.onclick = function(e) {
            menu.showPrevLevel();
            e.preventDefault();
            return false;
        }
    }
    let next = document.getElementById("ui-level-chooser-button-next");
    if (next) {
        next.onclick = function(e) {
            menu.showNextLevel();
            e.preventDefault();
            return false;
        }
    }
    let card = document.getElementById("ui-level-chooser-card");
    let custom = document.getElementById("ui-level-chooser-button-custom");
    if (custom) {
        custom.onclick = function(e) {
            card.className += " flipped";
            e.preventDefault();
            return false;
        }
//        let customok = document.getElementById("ui-level-chooser-custom-button-ok");
//        customok.onclick = function(e) {
//            // todo: custom stuff
//            card.className = card.className.replace(/flipped/g, '');
//            e.preventDefault();
//            return false;
//        }
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
    this.menu.resize();
    this.showLevelName();
}

MenuLevelChooser.prototype.showPrevLevel = function() {
    if (this.busy) return;
    this.busy = true;
    fadeOutHideFast(this.label);
    let prev = this.getPrevAvaliableLevel();
    let menu = this;
    let canvas = document.getElementById(this.canvasid);
    let newcanvas = this.cloneLevel(canvas, "level-next");
    let swaplevelname = this.levelkeys[prev];
    if (this.loadedlevels[swaplevelname]) {
        this.swaplevel = this.loadedlevels[swaplevelname];
        this.doLevelSwap(swaplevelname);
        fadeInFast(newcanvas);
        canvas.className += " level-prev";
        newcanvas.className = newcanvas.className.replace(/level-next/g, '');
        setTimeout(function() { menu.finishLevelSwap(prev) }, 2000);
        return;
    }
    let swaplevel = this.levels[swaplevelname];
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
    let next = this.getNextAvaliableLevel();
    let menu = this;
    let canvas = document.getElementById(this.canvasid);
    let newcanvas = this.cloneLevel(canvas, "level-prev");
    let swaplevelname = this.levelkeys[next];
    if (this.loadedlevels[swaplevelname]) {
        this.swaplevel = this.loadedlevels[swaplevelname];
        this.doLevelSwap(swaplevelname);
        fadeInFast(newcanvas);
        canvas.className += " level-next";
        newcanvas.className = newcanvas.className.replace(/level-prev/g, '');
        setTimeout(function() { menu.finishLevelSwap(next) }, 2000);
        return;
    }
    let swaplevel = this.levels[swaplevelname];
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
    let newcanvas = canvas.cloneNode();
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
    this.swaplevel.setTheme(this.loader.themes[this.swaplevel.theme]);
    this.loop.loadLevel(this.swaplevel);
    this.viewswap = new LevelView(this.canvasswapid);
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
    let canvas = document.getElementById(this.canvasid);
    canvas.parentNode.removeChild(canvas);
    let newcanvas = document.getElementById(this.canvasswapid);
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
        this.label.innerHTML = this.level.theme + " " + this.level.name;
        fadeInFast(this.label);
    }
}

MenuLevelChooser.prototype.startGame = function() {
    let b = document.getElementById("start-game");
    window.location = b.href;
}

