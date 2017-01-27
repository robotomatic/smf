UI = function(html) {
    this.ui = document.createElement("div");
    this.ui.id = "game-ui";
    this.ui.className = "game-ui fade-hide";
    this.ui.innerHTML = html;
}

UI.prototype.getUI = function() { return this.ui; }

UI.prototype.setLocation = function(x, y) {
    this.ui.style.left = x + "px";
    this.ui.style.top = y + "px";
}