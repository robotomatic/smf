function MenuView(id, width, height, scale) {
    this.view = new View(id, null, null, scale, "z-top");

    this.viewpad = 20;
    
    this.camera = new PartyViewCamera();
    
    this.drawleveldebug = false;
    this.drawplayerdebug = false;
    this.drawnpcdebug = false;
    
    this.lastp = null;
    
    this.ready = false;
    
    var controller = this;
    this.view.canvas_render.onclick = function() {
        controller.view.dirty = true;
        controller.camera.shakeScreen(10, 800);
    }
    
    this.viewwindow = new Rectangle();
    this.mbr = new Rectangle();
    this.transmbr = new Rectangle();
    this.levelbox = new Rectangle();
}

MenuView.prototype.view;
MenuView.prototype.setLevel = function(level) { this.view.setLevel(level); }
MenuView.prototype.addLayer = function(layer) { this.view.addLayer(layer); }
MenuView.prototype.resizeText = function() { this.view.resizeText(); }
MenuView.prototype.show = function() { 
    this.resizeUI();
    this.view.show(); 
}
MenuView.prototype.hide = function() { this.view.hide(); }

MenuView.prototype.resize = function() { 
    this.view.resize();
    this.resizeUI();
}
MenuView.prototype.resizeUI = function() { this.view.resizeUI(); }

MenuView.prototype.update = function(now, delta, stage) {

    this.view.update(now, delta, stage);
    
    if (!stage.players || !stage.players.length) return;
    
    for (var i = 0; i < stage.players.length; i++) {
        
        if (stage.players[i].x < 20 && stage.players[i].move_left) stage.players[i].left(false);
        else if (stage.players[i].x > stage.level.width - (stage.players[i].width + 20) && stage.players[i].move_right) stage.players[i].right(false);

        if (!stage.players[i].paused && !stage.players[i].move_left && !stage.players[i].move_right) {
            var dir = random(0, 2);
            if (dir == 0) {
                if (stage.players[i].x > 20) {
                    stage.players[i].lookStop();
                    stage.players[i].left(true);
                    stage.players[i].timeout("left", false, random(1000, 3000));
                }
            } else if (dir == 1) {
                if (stage.players[i].x < stage.level.width - (stage.players[i].width + 20)) {
                    stage.players[i].lookStop();
                    stage.players[i].right(true);
                    stage.players[i].timeout("right", false, random(1000, 3000));
                }
            } else {
                if (!stage.players[i].falling) {
                    var safe = true;
                    for (var ii = 0; ii < stage.players.length; ii++) {
                        if (ii == i) continue;
                        if (stage.players[ii].paused) {
                            var d = Math.abs(stage.players[ii].x - stage.players[i].x);
                            if (d < 20) {
                                safe = false;
                                break;
                            }
                        }
                    }
                    if (safe) {
                        stage.players[i].pause(true);
                        stage.players[i].timeout("pause", false, random(1000, 3000));
                    }
                }
            }
        }

        if (stage.players[i].falling) {
            if (!stage.players[i].jumpReleased) stage.players[i].jumpReleased = true;
        } else if (!stage.players[i].paused) {
            var r = random(1, 100);
            if (r == 1) {
                stage.players[i].jump(true);
            }
        }
    }
}

MenuView.prototype.render = function(now, delta, stage) { 
    
    if (!this.ready) this.ready = true;
    
    
    if (this.view.render(now, delta, stage)) {

        clearRect(this.view.ctx_buffer, 0, 0, this.view.canvas_buffer.width, this.view.canvas_buffer.height);
        for (var i = 0; i < stage.level.layers.length; i++) this.renderLayer(now, delta, stage, stage.level.layers[i]); 
        
        clearRect(this.view.ctx_render, 0, 0, this.view.canvas_render.width, this.view.canvas_render.height);
        this.view.ctx_render.drawImage(this.view.canvas_buffer, 0, 0);
        
        this.view.dirty=false;
    }
}

MenuView.prototype.renderLayer = function(now, delta, stage, layer) { 
    
    if (!stage.players) return;
    
    if (layer.draw === false) return;
    var layername = layer.name;
    
    var canvas = this.view.canvas_buffer;
    var ctx = this.view.ctx_buffer;
    
    var view = getViewWindow(canvas, stage.level.width, stage.level.height);
    var dx = (canvas.width - view.width) / 2;                 
    var dy = (canvas.height - view.height) - 100;               
    
    
    var centerpoint = new Point(dx, dy);
    var center = this.camera.getCenterPoint(now, centerpoint);
    dx += center.x - dx;
    dy += center.y - dy;
    
    clearRect(ctx, 0, 0, canvas.width, canvas.height);
    if (layername == "players") this.renderPlayers(now, delta, ctx, stage, view, stage.level.width, stage.level.height, dx, dy); 
    this.view.ctx_buffer.drawImage(canvas, 0, 0);
}

MenuView.prototype.renderPlayers = function(now, delta, ctx, stage, view, width, height, dx, dy) {
    for (var i = 0; i < stage.players.length; i++) this.renderPlayer(now, delta, ctx, stage.players[i], view, width, height, dx, dy);
}

MenuView.prototype.renderPlayer = function(now, delta, ctx, player, view, width, height, dx, dy) {
    
    var trans = new Rectangle(player.x, player.y, player.width, player.height);
    trans = translateItem(view.width, view.height, trans, width, height);

    var itemx = trans.x + dx;
    var itemy = trans.y + dy;
    
    var scale = (trans.width) ? trans.width / player.width : trans.height / player.height ;
 //   scale *= 2;

    player.draw(now, ctx, itemx, itemy, player.width * scale, player.height * scale, scale);            
}