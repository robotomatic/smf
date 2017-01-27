UI = function(ui) {
    this.ui = ui;
}

UI.prototype.getUI = function() { return this.ui; }

UI.prototype.setLocation = function(x, y) {
    this.ui.style.left = x + "px";
    this.ui.style.top = y + "px";
}

UI.prototype.setSize = function(w, h) {
    if (!this.ui) return;
    this.ui.style.width = w + "px";
    //  todo: figure this out...
    // this.ui.style.height = h + "px";
}

UI.prototype.setMessage = function(message) {
    this.ui.innerHTML = message;
}