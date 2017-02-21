function PlayerCamera(player) {
    this.player = player;
    this.camerabox = geometryfactory.getRectangle(player.controller.x, player.controller.y, player.controller.width, player.controller.height);    
}

PlayerCamera.prototype.updateCameraBox = function(scale) {
    this.camerabox.x = this.player.controller.lastX;
    this.camerabox.y = this.player.controller.lastY - this.player.controller.maxjumpheight;
    this.camerabox.z = this.player.controller.lastZ;
    this.camerabox.width = this.player.controller.width;
    this.camerabox.height = this.player.controller.height + this.player.controller.maxjumpheight;
    this.camerabox.depth = this.player.controller.depth;
}