"use strict"

function GameQuality() {
    var mobile = isMobile();
    var tablet = isTablet();
    var desktop = isDesktop();
    
    this.width = 800;
    this.height = 600;
    this.fov = 1500;
    this.scale = 1;
    
    if (mobile) {
        this.width = 800;
        this.height = 600;
        this.fov = 1500;
        this.scale = 1;
        this.device = "mobile";
    } else if (tablet) {
        this.width = 800;
        this.height = 600;
        this.fov = 1500;
        this.scale = 2;
        this.device = "tablet";
    } else {
        this.width = 800;
        this.height = 600;
        this.fov = 1500;
        this.scale = 2;
        this.device = "desktop";
    }
    
    logDev(this.device + ": " + this.width + "x" + this.height + " @ " + this.scale + "x");
    logDev("");
    setFOV(this.fov);
}