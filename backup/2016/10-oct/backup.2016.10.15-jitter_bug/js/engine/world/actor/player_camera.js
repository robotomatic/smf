function PlayerCamera(player) {
    this.camerabox = new Rectangle(player.controller.x + (player.controller.width / 2), player.controller.y, player.controller.width, player.controller.height);    
    this.lastwidth = 0;
    this.lastx = 0;
    this.speed = 1;
}

PlayerCamera.prototype.updateCameraBox = function(player) {
    
    // todo: anchor to ground point
    
    this.camerabox.x = player.controller.x + (player.controller.width / 2);
    this.camerabox.y = player.controller.y - player.controller.maxjumpheight;
    this.camerabox.z = player.controller.z;
    this.camerabox.width = player.controller.width;
    this.camerabox.height = player.controller.height + player.controller.maxjumpheight;
    
}
