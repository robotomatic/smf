"use strict"

function GameQuality(game, quality) {
    var mobile = isMobile();
    var tablet = isTablet();
    var desktop = isDesktop();
    if (mobile) {
        game.width = 800;
        game.height = 600;
        game.fov = 400;
        game.scale = 2;
        game.levelquality = quality;
        game.playerquality = quality  +1;
        game.device = "mobile";
    } else if (tablet) {
        game.width = 1024;
        game.height = 768;
        game.fov = 400;
        game.scale = 2;
        game.levelquality = quality;
        game.playerquality = quality  +1;
        game.device = "tablet";
    } else {
        game.width = 1024;
        game.height = 768;
        game.fov = 400;
        game.scale = 2;
        game.levelquality = quality;
        game.playerquality = quality  +1;
        game.device = "desktop";
    }
    
    game.width = 800;
    game.height = 350;
    game.fov = 800;
    game.scale = 1;
    game.levelquality = 2;
    game.playerquality = 3;
    
    logDev(game.device + ": " + game.width + "x" + game.height + " @ " + game.scale + "x");
    logDev("quality: level = " + game.levelquality + ", player = " + game.playerquality);
    logDev("");
    setFOV(game.fov);
}