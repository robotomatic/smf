"use strict";

function DevTools(controller, html) {
    
    return;
    
    this.id = null;
    this.now = null;
    this.last = timestamp();
    this.filter = 10;
    this.avg = 0;
    this.fps = 0;
    this.fps_step = 0;
    this.fps_report = 10;
    this.total_fps = 0;
    this.total_updates = 0;
    this.ui = {};
    this.ui.html = html;
    this.uiready = false;
    this.open = false;
    this.gamewindow = document.getElementById("main-content");
    let main = document.getElementById("main");
    let d = document.createElement("div");
    d.innerHTML = html;
    main.appendChild(d);
    this.initializeUI();
    this.controller = controller;
    this.stepspeed = 0;
}

DevTools.prototype.getUI = function() { return this.ui.html; }

DevTools.prototype.initializeUI = function() {
    
    return;
    
    this.ui.dev = document.getElementById("dev-ui");
    if (!this.ui.dev) return;
    let dt = this;
    this.ui.inner = document.getElementById("dev-tools-inner");
    this.ui.wrap = document.getElementById("dev-tools-inner-wrap");
    this.ui.fpstools = document.getElementById("dev-tools-fps");
    this.ui.fps = document.getElementById("dev-fps");
    this.ui.avg = document.getElementById("dev-avg-fps");
    this.ui.step = document.getElementById("dev-step-label");
    this.ui.slider = document.getElementById("dev-step");
    this.ui.slider.onchange = function() {
        let val = this.value;
        let speed = val / (100 / 60);
        dt.controller.game.loop.stepspeed = clamp(speed);
        dt.ui.slider.blur();
    }
    let leveldebug = document.getElementById("dev-level-debug");
    leveldebug.onchange = function() {
        let val = this.checked;
        dt.controller.game.view.drawleveldebug = val;
    }
    let playerdebug = document.getElementById("dev-player-debug");
    playerdebug.onchange = function() {
        let val = this.checked;
        dt.controller.game.view.drawplayerdebug = val;
    }
    let npcdebug = document.getElementById("dev-npc-debug");
    npcdebug.onchange = function() {
        let val = this.checked;
        dt.controller.game.view.drawnpcdebug = val;
    }
    this.ui.button = document.getElementById("dev-tools-button");
    this.ui.button.onclick = function(e) {
        dt.ui.button.className += " fa-spin";
        setTimeout(function() { dt.ui.button.className = dt.ui.button.className.replace(/\bfa-spin\b/,''); }, 200);
        if (dt.open) dt.hideUI();
        else dt.showUI();
        e.preventDefault();
        return false;
    }
    this.uiready = (this.ui.fps && this.ui.avg) ? true : false;
}

DevTools.prototype.showUI = function() {
    
    return;
    
    this.ui.dev.className = this.ui.dev.className.replace(/dev-tools-collapse/g,'');
    this.ui.inner.className = this.ui.inner.className.replace(/dev-tools-inner-collapse/g,'');
    fadeIn(this.ui.wrap);
    this.open = true;
}

DevTools.prototype.hideUI = function() {
    
    return;
    
    this.ui.dev.className += " dev-tools-collapse";
    this.ui.inner.className += " dev-tools-inner-collapse";
    fadeOutHide(this.ui.wrap);
    this.open = false;
}

DevTools.prototype.resize = function() {
    
    return;
    
    let dw = document.body.clientWidth;
    let winrect = this.gamewindow.getBoundingClientRect();
    let top = winrect.bottom - 65;
    let right = dw - winrect.right + 8;
    this.setLocation(right, top);
    if (this.ui.dev) fadeIn(this.ui.dev);
}

DevTools.prototype.setLocation = function(x, y) {
    
    return;
    
    if (!this.uiready) this.initializeUI();
    if (!this.uiready) return;
    this.ui.dev.style.right = x + "px";
    this.ui.dev.style.top = y + "px";
}

DevTools.prototype.update = function(now) {
    
    return;
    
    if (!this.controller.game || !this.controller.game.loop) return;
    this.now = now;
    this.updateFPS();
    this.updateStep();
    this.last = this.now;
}

DevTools.prototype.updateStep = function() {
    
    return;
    
    if (this.stepspeed != this.controller.game.loop.stepspeed) {
        this.stepspeed = this.controller.game.loop.stepspeed;
        this.showStep();
    }
}

DevTools.prototype.showStep = function() {
    
    return;
    
    if (!this.uiready) this.initializeUI();
    if (!this.uiready) return;
    this.ui.step.innerHTML = "Game Speed: " + this.stepspeed;
    
    let speed = this.stepspeed * (100 / 60);
    this.ui.slider.value = speed;
}

DevTools.prototype.updateFPS = function() {
    
    return;
    
    let delay = this.now - this.last;
    this.avg += (delay - this.avg) / this.filter;
    let fps = (1000 / this.avg).toFixed(1);
    this.fps = fps;
    this.total_fps += Number(fps);
    this.total_updates++;
    this.showFPS();
}

DevTools.prototype.showFPS = function() {
    
    return;
    
    if (!this.uiready) this.initializeUI();
    if (!this.uiready) return;
    if (this.fps_step++ >= this.fps_report) {
        this.ui.fps.innerHTML = "FPS: " + this.fps;
        this.ui.fps.className = this.getFPSClass(this.fps);
        let avg_fps = this.total_fps / this.total_updates;
        this.ui.avg.innerHTML = "AVG: " + avg_fps.toFixed(1);
        this.ui.avg.className = this.getFPSClass(avg_fps);
        this.fps_step = 0;
    }
}

DevTools.prototype.getFPSClass = function(fps) {
    
    return;
    
    if (fps > 50) return "aok";
    else if (fps < 40) return "afu";
    else return "uhoh";
}