DevTools = function() {
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
}

DevTools.prototype.getUI = function() {
    var div = document.createElement("div");
    div.className = "dev";
    var p = document.createElement("p");
    p.className = "fps";
    div.appendChild(p);
    this.ui.div = div;
    this.ui.fps = p;
    return div;
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
    if (this.fps_step++ >= this.fps_report) {
        var fpsclass = this.getFPSClass(this.fps);
        var ui_fps = "FPS: <span class='" + fpsclass + "'>" + this.fps + "</span>";
        var avg_fps = this.total_fps / this.total_updates;
        var avgclass = this.getFPSClass(avg_fps);
        var ui_avg = "AVG: <span class='" + avgclass + "'>" + avg_fps.toFixed(1) + "</span>";
        this.ui.fps.innerHTML = ui_fps + "<br />" + ui_avg;
        this.fps_step = 0;
    }
}

DevTools.prototype.getFPSClass = function(fps) {
    if (fps > 50) return "aok";
    else if (fps < 40) return "afu";
    else return "uhoh";
}