function GameView(id, players, width, height) {
    this.id = id;
    this.players = players;
    this.width = width;
    this.height = height;
    this.canvas = document.getElementById(this.id);
    this.parent = this.canvas.parentNode;
    this.ctx = this.canvas.getContext("2d");
}

GameView.prototype.resize = function() {
	this.canvas.width = this.parent.offsetWidth;
	this.canvas.height = this.parent.offsetHeight;
}

GameView.prototype.render = function(delta, stage) {
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
  
    var viewBuffer = 10;
    var mbr = getMbr(stage.players, (this.width > this.height) ? this.width / viewBuffer : this.height / viewBuffer);
    var mbr_x = mbr.x;
    var mbr_y = mbr.y;
    var mbr_w = mbr.width;
    var mbr_h = mbr.height;

    var zoom = (vtrans.width > vtrans.height) ? vtrans.height / mbr.height : vtrans.width / mbr.width;
    
    var nh = mbr.height * zoom;
    if (nh > vtrans.height) {
        var diff = vtrans.height / nh;
        mbr.x -= (mbr.width * diff) / 2;
        mbr.width *= diff;
        mbr.y -= (mbr.height * diff) / 2;
        mbr.height *= diff;
    }

    var nw = mbr.width * zoom;
    if (nw > vtrans.width) {
        var diff = vtrans.width / nw;
        mbr.y -= (mbr.height * diff) / 2;
        mbr.height *= diff;
        mbr.x -= (mbr.width * diff) / 2;
        mbr.width *= diff;
    }
    
    var cx = this.canvas.width / 2;
    var cy = this.canvas.height / 2;
    
    var cmbrtrans = {
        "x" : cx - ((mbr.width * zoom) / 2),
        "y" : cy - ((mbr.height * zoom) / 2),
        "width" : mbr.width * zoom,
        "height" : mbr.height * zoom
    };
    
    var hd = vtrans.height - cmbrtrans.height;
    if (cmbrtrans.height < vtrans.height) {
        
        // todo: this should only happen if ground is visible...
        
        cmbrtrans.y += hd / 2;
    }

    /*
    this.ctx.fillStyle = "lightgray";
    drawRect(this.ctx, cmbrtrans.x, cmbrtrans.y, cmbrtrans.width, cmbrtrans.height);            
    */

    var scale = (cmbrtrans.width > cmbrtrans.height) ?  cmbrtrans.width / mbr_w : cmbrtrans.height / mbr_h;

    for (var i = 0; i < stage.players.length; i++) {
        var p = stage.players[i];
        var px = (p.x - mbr_x) * scale;
        var py = (p.y - mbr_y) * scale;
        this.ctx.fillStyle = p.color;
        drawRect(this.ctx, cmbrtrans.x + px, cmbrtrans.y + py, p.width * scale, p.height * scale);            
    }

    for (var i = 0; i < stage.level.items.length; i++) {
        var item = stage.level.items[i];
        var ix = (item.x - mbr_x) * scale;
        var iy = (item.y - mbr_y) * scale;
        this.ctx.fillStyle = item.color ? item.color : "black";
        drawRect(this.ctx, cmbrtrans.x + ix, cmbrtrans.y + iy, item.width * scale, item.height * scale);            
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