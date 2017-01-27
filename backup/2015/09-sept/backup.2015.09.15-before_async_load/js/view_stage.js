function StageView(id) {
    this.id = id;
    this.canvas = document.getElementById(this.id);
    this.parent = this.canvas.parentNode;
    this.ctx = this.canvas.getContext("2d");
}

StageView.prototype.resize = function() {
	this.canvas.width = this.parent.offsetWidth;
	this.canvas.height = this.parent.offsetHeight;
}

StageView.prototype.render = function(delta, stage) {
    clearRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height);
    var vbox = {
        "x" : 0,
        "y" : 0,
        "width" : stage.level.width, 
        "height" : stage.level.height
    }
    var vtrans = translateItem(this.canvas.width, this.canvas.height, vbox, stage.level.width, stage.level.height);
    this.ctx.fillStyle = "white";
    drawRect(this.ctx, vtrans.x, vtrans.y, vtrans.width, vtrans.height);
    
    /*
    var mbr = getMbr(stage.players);
    var smbr = makeSquare(mbr);
    smbr["color"] = "yellow";
    this.renderStageItem(smbr, stage);
    mbr["color"] = "lightgray";
    this.renderStageItem(mbr, stage);
    */
      
    for (var i = 0; i < stage.players.length; i++) this.renderStageItem(stage.players[i], stage);
    for (var i = 0; i < stage.level.items.length; i++) this.renderStageItem(stage.level.items[i], stage);

    var dw = this.canvas.width - vtrans.width;
    var bw = dw / 2;
    clearRect(this.ctx, 0, 0, bw, this.canvas.height);        
    clearRect(this.ctx, bw + vtrans.width, 0, bw, this.canvas.height);        

    var dh = this.canvas.height - vtrans.height;
    var bh = dh / 2;
    clearRect(this.ctx, 0, 0, this.canvas.width, bh);        
    clearRect(this.ctx, 0, vtrans.height + bh, this.canvas.width, bh);        
}

StageView.prototype.renderStageItem = function(item, stage) {
    var trans = translateItem(this.canvas.width, this.canvas.height, item, stage.level.width, stage.level.height);
    this.ctx.fillStyle = (item.color) ? item.color : "black";
    drawRect(this.ctx, trans.x, trans.y, trans.width, trans.height);    
}