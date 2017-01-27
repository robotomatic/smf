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
    
    if (stage.level.background) {
        if (stage.level.background.color) {
            this.ctx.fillStyle = stage.level.background.color;
            drawRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height);            
        }
    }
    
    var vbox = {
        "x" : 0,
        "y" : 0,
        "width" : this.width, 
        "height" : this.height
    }
    var vtrans = translateItem(this.canvas.width, this.canvas.height, vbox, this.width, this.height);

    var cx = this.width / 2;
    var cy = (this.height / 2);

    var pbox = {
        "x" : cx - ((this.player.width * this.zoom) / 2),
        "y" : cy - ((this.player.height * this.zoom) / 2),
        "width" : this.player.width * this.zoom, 
        "height" : this.player.height * this.zoom
    }
    var ptrans = translateItem(this.canvas.width, this.canvas.height, pbox, this.width, this.height);

    var x = this.player.x;
    var y = this.player.y;

    var pw = this.player.width * this.zoom;
    var ph = this.player.height * this.zoom;
    var px = x * this.zoom;
    var py = y * this.zoom;
    var dx = cx - (px + (pw / 2) );
    var dy = cy - (py + (ph / 2) );

    var bounds = {
        "x" : 0,
        "y" : 0,
        "width" : stage.level.width,
        "height" : stage.level.height
    }
    var bounds_rel = translateRelative(bounds, dx, dy, this.zoom);
    var bounds_trans = translateItem(this.canvas.width, this.canvas.height, bounds_rel, this.width, this.height);
    var bounds_bottom_y = bounds_trans.y + bounds_trans.height;
    var border_height = (this.canvas.height - vtrans.height)  / 2;
    var border_top = vtrans.height + border_height;
    var height_diff = border_top - bounds_bottom_y;
    var offset_y = (height_diff > 0) ? height_diff : 0;
    
    /*
    this.ctx.fillStyle = "magenta";
    drawRect(this.ctx, 0, bounds_bottom_y, this.canvas.width, height_diff);        

    this.ctx.fillStyle = "yellow";
    drawRect(this.ctx, 0, border_top, this.canvas.width, border_height);        
    */
    
    for (var i = 0; i < stage.level.items.length; i++) {
        
        // todo: need to tell if item is in view
        
        var item = stage.level.items[i];

        if (item.draw == false) continue;
        var rel = translateRelative(item, dx, dy, this.zoom);
        var rtrans = translateItem(this.canvas.width, this.canvas.height, rel, this.width, this.height);
        
        var color;
        if (item.color) {
            if (item.color.gradient) {
                var gradient = item.color.gradient;
                var g = this.ctx.createLinearGradient(0, rtrans.y + offset_y, 0, rtrans.height + rtrans.y + offset_y);        
                g.addColorStop(0, gradient.start);
                g.addColorStop(1, gradient.stop);
                color = g;
            } else color = item.color;
        } else color = "gray";
        this.ctx.fillStyle = color;

        var itemx = rtrans.x;
        var itemwidth = rtrans.width;
        if (item.width == "100%") {
            itemx = 0;
            itemwidth = this.canvas.width;
        }

        drawRect(this.ctx, itemx, rtrans.y + offset_y, itemwidth, rtrans.height);        
    }
    
    for (var i = 0; i < stage.players.length; i++) {
        var opponent = stage.players[i];
        if (opponent===this.player) continue;
        
        // todo: need to tell if item is in view
        
        var rel = translateRelative(opponent, dx, dy, this.zoom);
        var rtrans = translateItem(this.canvas.width, this.canvas.height, rel, this.width, this.height);
        opponent.draw(this.ctx, rtrans.x, rtrans.y + offset_y, rtrans.width, rtrans.height);
    }

    this.player.draw(this.ctx, ptrans.x, ptrans.y + offset_y, ptrans.width, ptrans.height);            

    var dw = this.canvas.width - vtrans.width;
    var bw = dw / 2;
    clearRect(this.ctx, 0, 0, bw, this.canvas.height);        
    clearRect(this.ctx, bw + vtrans.width, 0, bw, this.canvas.height);        
    
    var dh = this.canvas.height - vtrans.height;
    var bh = dh / 2;
    clearRect(this.ctx, 0, 0, this.canvas.width, bh);        
    clearRect(this.ctx, 0, vtrans.height + bh, this.canvas.width, bh);        
}