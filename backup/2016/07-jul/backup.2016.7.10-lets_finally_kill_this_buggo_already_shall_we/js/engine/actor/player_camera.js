function PlayerCamera(player) {
    this.camerabox = new Rectangle(player.controller.x, player.controller.y, player.controller.width, player.controller.height);    
    this.lastwidth = 0;
    this.lastx = 0;
    this.speed = .1;
}

PlayerCamera.prototype.updateCameraBox = function(player) {

    var pp = player.getLocation();
    var pw = player.controller.width;
    var px = pp.x;
    var pc = px + (pw / 2);
    
//    var s = Math.abs(player.controller.velX);
//    
//    var f = 50 * s || 1;
//    var camwidth = pw * f;
//    
//    if (!this.lastwidth) this.lastwidth = camwidth;
//    var d = camwidth - this.lastwidth;
//    
//    camwidth = this.lastwidth + (d * this.speed);
//
//    var camx = pc - (camwidth / 2);

    var camx = px;
    var camwidth = pw;
    
//    var velX = player.controller.velX;
//    var amt = 5;
//    var maxcamwidth = Math.abs(round(camwidth * velX * amt)) || pw;
//
//    if (velX > 0) {
//        if (this.lastwidth < maxcamwidth) camwidth = this.lastwidth + this.speed;
//        else camwidth = this.lastwidth - this.speed;
//    } else if (velX < 0) {
//        if (this.lastwidth < maxcamwidth) camwidth = this.lastwidth + this.speed;
//        else camwidth = this.lastwidth - this.speed;
//        camx = camx - camwidth + pw;
//    }
//    
//    if (camx > this.lastx) camx = this.lastx + this.speed;
//    else if (camx < this.lastx) camx = this.lastx - this.speed;
//    
//    this.lastwidth = camwidth;
//    this.lastx = camx;
    
    if (isNaN(player.controller.maxjumpheight)) player.controller.maxjumpheight = 1;
    var camheight = player.controller.maxjumpheight + player.controller.height;
    if (camheight < player.controller.height || isNaN(camheight)) camheight = player.controller.height;
    
    var jp = player.controller.jumpstarty;
    
    var camy = jp ? jp : pp.y;
    camy += player.controller.height - camheight;
    
    var dj = pp.y - jp;
    if (dj > 5) camy += dj; 
    
    this.camerabox.x = camx;
    this.camerabox.y = camy;
    this.camerabox.width = camwidth;
    this.camerabox.height = camheight;
    
    this.camerabox.x = round(this.camerabox.x);
    this.camerabox.y = round(this.camerabox.y);
    this.camerabox.width = round(this.camerabox.width);
    this.camerabox.height = round(this.camerabox.height);
}
