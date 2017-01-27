ViewRenderer = function(quality, playerquality) {
    this.debug = false;
    this.mbr = new Rectangle(0, 0, 0, 0);
    this.window = new Rectangle(0, 0, 0, 0);
    this.camera = new ViewCamera();
    this.quality = quality;
    this.playerquality = playerquality ? playerquality : quality;
}

ViewRenderer.prototype.render = function(now, stage, ctx, width, height) {
    
    clearRect(ctx, 0, 0, width, height);
    this.mbr = this.camera.getView(now, this.mbr, width, height);
    
    var x = this.mbr.x;
    var y = this.mbr.y;

    var scale = width / this.mbr.width;

    var svw = width / scale;
    var dw = svw - this.mbr.width;
    if (dw) x = x - dw / 2;
    var svh = height / scale;
    var dh = svh - this.mbr.height;
    if (dh) y = y - dh / 2;

    // todo: config this
    var winpad = (this.debug) ? 10 : -50;
    
    this.window.width = this.mbr.width - (winpad * 2);
    this.window.height = svh - (winpad * 2);
    this.window.x = x + winpad;
    this.window.y = y + winpad;

    // todo:
    
    //  - render each bg
    
    // - render players in each fg
    //  - render each fg
    
    //  - render jumping/falling players
    //  - render ffg
    
    
    stage.level.render(now, ctx, this.window, x, y, scale, this.quality);
    
    var players = stage.players;
    if (!players || !players.players || !players.players.length) return; 
    players.render(now, this.window, ctx, x, y, scale, this.playerquality);
}