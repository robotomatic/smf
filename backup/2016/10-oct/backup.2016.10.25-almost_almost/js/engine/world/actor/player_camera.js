function PlayerCamera(player) {
    this.player = player;
    this.camerabox = new Rectangle(player.controller.x, player.controller.y, player.controller.width, player.controller.height);    
}

PlayerCamera.prototype.updateCameraBox = function(scale) {
    
//    this.camerabox.x = this.player.box.x;
//    this.camerabox.y = this.player.box.y;
//    this.camerabox.z = this.player.box.z;
//    this.camerabox.width = this.player.box.width;
//    this.camerabox.height = this.player.box.height;
    
    this.camerabox.x = this.player.controller.lastX;
    this.camerabox.y = this.player.controller.lastY - this.player.controller.maxjumpheight;
    this.camerabox.z = this.player.controller.lastZ;
    this.camerabox.width = this.player.controller.width;
    this.camerabox.height = this.player.controller.height + this.player.controller.maxjumpheight;
    this.camerabox.depth = this.player.controller.depth;
}





//PlayerCamera.prototype.updateCameraBox = function(window, width, height) {
//    
//    var x = window.x;
//    var y = window.y;
//    var z = window.z;
//    var scale = window.scale;
//    
//    this.camerabox.x = (this.player.controller.groundpoint.x - x) * scale;
//    this.camerabox.y = ((this.player.controller.groundpoint.y- this.player.controller.maxjumpheight) - y) * scale;
//    this.camerabox.z = (this.player.controller.groundpoint.x - z) * scale;
//    
//    this.camerabox.width = this.player.controller.width * scale;
//    this.camerabox.height = (this.player.controller.height + this.player.controller.maxjumpheight) * scale;
//
//    var wc = window.getCenter();
//    this.camerabox = projectRectangle3D(this.camerabox, this.camerabox.z, scale, x, y, wc);
//}
