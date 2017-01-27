function DevTools(html) {
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

DevTools.prototype.getUI = function() { return this.ui.html; }

DevTools.prototype.initializeUI = function() {
    this.ui.fpstools = document.getElementById("dev-tools-fps");
    this.ui.fps = document.getElementById("dev-fps");
    this.ui.avg = document.getElementById("dev-avg-fps");
    var dt = this;
    var button = document.getElementById("dev-tools-button");
    button.onclick = function(e) {
        button.className += " fa-spin";
        if (dt.open) dt.hideUI();
        else dt.showUI();
        button.className = button.className.replace(/\bfa-spin\b/,'');
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