function PlayerView(id, player, width, height, zoom) {
    this.id = id;
    this.player = player;
    this.width = width;
    this.height = height;
    this.zoom = zoom ? zoom : 1;
    this.canvas = document.getElementById(this.id);
    this.parent = this.canvas.parentNode;
    this.ctx = this.canvas.getContext("2d");
};

PlayerView.prototype.resize = function() {
	this.canvas.width = this.parent.offsetWidth;
	this.canvas.height = this.parent.offsetHeight;
}

PlayerView.prototype.render = function(delta, stage) {
    clearRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height);
    var vbox = {
        "x" : 0,
        "y" : 0,
        "width" : this.width, 
        "height" : this.height
    }
    var vtrans = translateItem(this.canvas.width, this.canvas.height, vbox, this.width, this.height);
    this.ctx.fillStyle = "white";
    drawRect(this.ctx, vtrans.x, vtrans.y, vtrans.width, vtrans.height);
    
    var cx = this.width / 2;
    var dl = 0;
    var boxx = cx;
    var qw = this.width / 4;
    if (this.player.x <= qw) {
        dl = qw - this.player.x;
        boxx = this.player.x * this.zoom;
    } else if (this.player.x >= stage.level.width - qw) {
        var edgedist = stage.level.width - this.player.x;
        dl = (this.width - qw) - (this.width - edgedist);
        boxx = this.width - (edgedist * this.zoom);
    }

    var cy = (this.height / 2) + (this.height / 4);

    var pbox = {
        "x" : boxx - ((this.player.width * this.zoom) / 2),
        "y" : cy - ((this.player.height * this.zoom) / 2),
        "width" : this.player.width * this.zoom, 
        "height" : this.player.height * this.zoom
    }
    var ptrans = translateItem(this.canvas.width, this.canvas.height, pbox, this.width, this.height);
    this.ctx.fillStyle = this.player.color;
    drawRect(this.ctx, ptrans.x, ptrans.y, ptrans.width, ptrans.height);        

    var x = this.player.x + dl;
    var y = this.player.y;
    
    var pw = this.player.width * this.zoom;
    var ph = this.player.height * this.zoom;
    var px = x * this.zoom;
    var py = y * this.zoom;
    var dx = cx - (px + (pw / 2) );
    var dy = cy - (py + (ph / 2) );
    
    for (var i = 0; i < stage.level.items.length; i++) {
        
        // todo: need to tell if item is in view
        
        var rel = translateRelative(stage.level.items[i], dx, dy, this.zoom);
        var rtrans = translateItem(this.canvas.width, this.canvas.height, rel, this.width, this.height);
        this.ctx.fillStyle = stage.level.items[i].color ? stage.level.items[i].color : "black";
        drawRect(this.ctx, rtrans.x, rtrans.y, rtrans.width, rtrans.height);        
    }
    for (var i = 0; i < stage.players.length; i++) {
        var opponent = stage.players[i];
        if (opponent===this.player) continue;
        
        // todo: need to tell if item is in view
        
        var rel = translateRelative(opponent, dx, dy, this.zoom);
        var rtrans = translateItem(this.canvas.width, this.canvas.height, rel, this.width, this.height)
        this.ctx.fillStyle = opponent.color;
        drawRect(this.ctx, rtrans.x, rtrans.y, rtrans.width, rtrans.height);        
    }

    var dw = this.canvas.width - vtrans.width;
    var dh = this.canvas.height - vtrans.height;
    
    var bw = dw / 2;
    clearRect(this.ctx, 0, 0, bw, this.height);        
    clearRect(this.ctx, bw + vtrans.width, 0, bw, this.height);        
    
    var bh = dh / 2;
    clearRect(this.ctx, 0, 0, this.width, bh);        
    clearRect(this.ctx, 0, vtrans.height + bh, this.width, bh);        
}