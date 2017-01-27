function Stage(level, players, views) {
    this.level = level;
    this.players = players;
    this.views = views;
    this.physics = {
        friction: 0.8,
        airfriction: .9,
        gravity: 0.3,
        terminalVelocity: 12,
        wallfriction: 0
    };
}

Stage.prototype.getLevel = function() { return this.level; }
Stage.prototype.getPlayers = function() { return this.players; }
Stage.prototype.getViews = function() { return this.views; }
Stage.prototype.getPhysics = function() { return this.physics; }


Stage.prototype.drawStage = function(ctx, x, y, width, height, offsety, scale) {
    if (this.level.background) {
        if (this.level.background.color) {
            if (this.level.background.color.gradient) {
                var gradient = this.level.background.color.gradient;
                if (!scale) {
                    var g = ctx.createLinearGradient(0, 0, 0, this.level.height);        
                    g.addColorStop(0, gradient.start);
                    g.addColorStop(1, gradient.stop);
                    ctx.fillStyle = g;
                    ctx.fillRect(x, y, width, height);        
                    return;
                }

                if (!offsety) offsety = 0;

                var levelheight = this.level.height * scale;
                var g = ctx.createLinearGradient(0, 0, 0, this.level.height / 2);        
                
                
                //if ()
                
                
                var dy = y;
                dy = y + ((y - offsety) * scale);
                dy = y - (levelheight - offsety) * scale;
                
                dy = 130;
                
                // WTFFFFFFFFFF
                
                
                

                //console.log(height + " == " + levelheight);

                var fillheight = levelheight;

                g.addColorStop(0, this.level.background.color.gradient.start);
                g.addColorStop(1, this.level.background.color.gradient.stop);
                ctx.fillStyle = g;
                ctx.fillRect(x, dy, width, fillheight);        

                return;
            }
            ctx.fillStyle = this.level.background.color;
            drawRect(ctx, x, dy, width, height);
            return;
        }
    }
    ctx.fillStyle = this.level.color ? this.level.color : "white";
    drawRect(ctx, x, y, width, height);
}