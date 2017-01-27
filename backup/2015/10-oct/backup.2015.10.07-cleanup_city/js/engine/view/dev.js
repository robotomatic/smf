function DevTools(html) {
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
}

DevTools.prototype.setID = function(id) { this.id = id; }

DevTools.prototype.getUI = function() { return this.ui.html; }

DevTools.prototype.initializeUI = function() {
    
    if (!this.id) return;
    
    this.ui.dev = document.getElementById(this.id);
    
    if (!this.ui.dev) return;
    
    var fpstools = this.ui.dev.querySelector("#dev-tools-fps");
    
    if (!fpstools) return;
    
    fpstools.id = this.id + "-dev-tools-fps";
    this.ui.fpstools = document.getElementById(fpstools.id);
    
    var fps = this.ui.dev.querySelector("#dev-fps");
    fps.id = this.id + "-dev-fps";
    this.ui.fps = document.getElementById(fps.id);
    
    var avg = this.ui.dev.querySelector("#dev-avg-fps");
    avg.id = this.id + "-dev-avg-fps";
    this.ui.avg = document.getElementById(avg.id);
    
    var dt = this;
    var button = this.ui.dev.querySelector("#dev-tools-button");
    button.id = this.id + "-button";
    this.ui.button = document.getElementById(button.id);
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
    this.ui.fpstools.className = this.ui.fpstools.className.replace(/dev-tools-collapse/g,'');
    this.open = true;
}

DevTools.prototype.hideUI = function() {
    this.ui.fpstools.className += " dev-tools-collapse";
    this.open = false;
}

DevTools.prototype.setLocation = function(x, y) {
    if (!this.uiready) this.initializeUI();
    if (!this.uiready) return;
    this.ui.dev.style.right = x + "px";
    this.ui.dev.style.top = y + "px";
}

DevTools.prototype.update = function() {
    this.now = timestamp();
    var delay = this.now - this.last;
    this.avg += (delay - this.avg) / this.filter;
    var fps = (1000 / this.avg).toFixed(1);
    this.fps = fps;
    this.total_fps += Number(fps);
    this.total_updates++;
    this.showFPS();
    this.last = this.now;
}

DevTools.prototype.showFPS = function() {
    if (!this.uiready) this.initializeUI();
    if (!this.uiready) return;
    if (this.fps_step++ >= this.fps_report) {
        this.ui.fps.innerHTML = "FPS: " + this.fps;
        this.ui.fps.className = this.getFPSClass(this.fps);
        var avg_fps = this.total_fps / this.total_updates;
        this.ui.avg.innerHTML = "AVG: " + avg_fps.toFixed(1);
        this.ui.avg.className = this.getFPSClass(avg_fps);
        this.fps_step = 0;
    }
}

DevTools.prototype.getFPSClass = function(fps) {
    if (fps > 50) return "aok";
    else if (fps < 40) return "afu";
    else return "uhoh";
}