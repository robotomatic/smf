function PlayerCamera(player) {
    this.camerabox = new Rectangle(player.controller.x, player.controller.y, player.controller.width, player.controller.height);    
}

PlayerCamera.prototype.updateCameraBox = function(player) {
    var camx = player.controller.x;
    var camwidth = player.controller.width;
    if (isNaN(player.controller.maxjumpheight)) player.controller.maxjumpheight = 1;
    var camheight = player.controller.maxjumpheight + player.controller.height;
    if (camheight < player.controller.height || isNaN(camheight)) camheight = player.controller.height;
    var camy = player.controller.y + player.controller.height - camheight;
    var jp = player.controller.jumpstarty;
    var dy = jp - player.controller.y;
    camy += dy;
    var dj = player.controller.y - jp;
    if (dj > 5) camy += dj; 
    this.camerabox.x = camx;
    this.camerabox.y = camy;
    this.camerabox.width = camwidth;
    this.camerabox.height = camheight;
}
