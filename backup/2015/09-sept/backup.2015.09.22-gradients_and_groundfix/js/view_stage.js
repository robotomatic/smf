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
    if (stage.level.background) {
        if (stage.level.background.color) {
            this.ctx.fillStyle = stage.level.background.color;
            drawRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height);            
        }
    }
    var vbox = {
        "x" : 0,
        "y" : 0,
        "width" : stage.level.width, 
        "height" : stage.level.height
    }
    var vtrans = translateItem(this.canvas.width, this.canvas.height, vbox, stage.level.width, stage.level.height);
    
    /*
    var mbr = getMbr(stage.players);
    var smbr = makeSquare(mbr);
    smbr["color"] = "yellow";
    this.renderStageItem(smbr, stage);
    mbr["color"] = "lightgray";
    this.renderStageItem(mbr, stage);
    */

    var dy = (this.canvas.height - vtrans.height);
      
    for (var i = 0; i < stage.level.items.length; i++) {
        var item = stage.level.items[i];
        if (item.draw == false) continue;
        var trans = translateItem(vtrans.width, vtrans.height, item, stage.level.width, stage.level.height);
        
        var color;
        if (item.color) {
            if (item.color.gradient) {
                var gradient = item.color.gradient;
                var g = this.ctx.createLinearGradient(0, trans.y + dy, 0, trans.height + (trans.y + dy));        
                g.addColorStop(0, gradient.start);
                g.addColorStop(1, gradient.stop);
                color = g;
            } else color = item.color;
        } else color = "gray";
        this.ctx.fillStyle = color;
        
        var itemx = trans.x;
        var itemwidth = trans.width;
        if (item.width == "100%") {
            itemx = 0;
            itemwidth = this.canvas.width;
        }
        
        drawRect(this.ctx, itemx, trans.y + dy, itemwidth, trans.height);    
    }
    
    for (var i = 0; i < stage.players.length; i++) {
        var trans = translateItem(vtrans.width, vtrans.height, stage.players[i], stage.level.width, stage.level.height);
        stage.players[i].draw(this.ctx, trans.x, trans.y + dy, trans.width, trans.height);    
    }
}