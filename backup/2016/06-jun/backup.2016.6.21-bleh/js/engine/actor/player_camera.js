function PlayerCamera(player) {
    this.camerabox = new Rectangle(player.controller.x, player.controller.y, player.controller.width, player.controller.height);    
}

PlayerCamera.prototype.updateCameraBox = function(player) {

    var camx = player.controller.x;
    var camwidth = player.controller.width;
    
    if (isNaN(player.controller.maxjumpheight)) player.controller.maxjumpheight = 1;
    var camheight = player.controller.maxjumpheight + player.controller.height;
    if (camheight < player.controller.height || isNaN(camheight)) camheight = player.controller.height;
    
    
    var jp = player.controller.jumpstarty;
    
    var camy = jp ? jp : player.controller.y;
    camy += player.controller.height - camheight;
    
    var dj = player.controller.y - jp;
    if (dj > 5) camy += dj; 
    
    this.camerabox.x = round(camx);
    this.camerabox.y = round(camy);
    this.camerabox.width = round(camwidth);
    this.camerabox.height = round(camheight);
}
