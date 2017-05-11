function PlayerCamera(player) {
    this.player = player;
    this.ready = false;
    this.camerabox = new Rectangle(player.controller.x, player.controller.y, player.controller.width, player.controller.height);    
}

PlayerCamera.prototype.reset = function() {
    this.ready = false;
    this.camerabox.width = 0;
    this.camerabox.height = 0;
}


PlayerCamera.prototype.updateCameraBox = function() {
    this.camerabox.x = this.player.controller.x;
    var jp = max(this.player.controller.groundpoint.y, this.player.controller.y + this.player.controller.height);
    var jh = this.player.controller.maxjumpheight + this.player.controller.height;
    this.camerabox.y = jp - jh;
    this.camerabox.z = this.player.controller.lastZ;
    this.camerabox.width = this.player.controller.width;
    this.camerabox.height = jh;
    this.camerabox.depth = this.player.controller.depth;
    this.ready = true;
}