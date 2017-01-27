ViewRenderer = function(quality, playerquality) {
    this.debug = false;
    this.mbr = new Rectangle(0, 0, 0, 0);
    this.window = new Rectangle(0, 0, 0, 0);
    this.camera = new ViewCamera();
    this.quality = quality;
    this.playerquality = playerquality ? playerquality : quality;
    this.first = true;
}

ViewRenderer.prototype.render = function(now, stage, ctx, width, height) {
    
    clearRect(ctx, 0, 0, width, height);
    
    this.mbr = this.camera.getView(now, this.mbr, width, height);

//    var wdx = round(this.mbr.x - this.camera.box.x);
//    var wdy = round(this.mbr.y - this.camera.box.y);
    
    var offy = 25;
    
    var x = this.mbr.x;
    var y = this.mbr.y + offy;
    
    var scale = round(width / this.mbr.width);
    
    var svw = width / scale;
    var dw = svw - this.mbr.width;
    if (dw) x = x - dw / 2;
    var svh = height / scale;
    var dh = svh - this.mbr.height;
    if (dh) y = y - dh / 2;

    var winpad = -150;
    
    var ww = this.mbr.width - (winpad * 2);
    var wh = svh - (winpad * 2)
    var wx = x + winpad;
    var wy = y + winpad;
    
//    ww = round(ww);
//    wh = round(wh);
//    wx = round(wx);
//    wy = round(wy);
    
    this.window.width = ww;
    this.window.height = wh;
    this.window.x = wx;
    this.window.y = wy;

//    x = round(x);
//    y = round(y);
    
    
    // todo:
    
    //  - render each bg
    
    // - render players in each fg
    //  - render each fg
    
    //  - render jumping/falling players
    //  - render ffg
    
    var players = stage.players;
    stage.level.render(now, ctx, this.window, x, y, scale, this.quality, this.first, this.debug);
    
    if (players  && players.players && players.players.length) {
        players.render(now, this.window, ctx, x, y, scale, this.playerquality);
    }
    
    this.first = false;
    
}