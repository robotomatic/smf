'use strict';

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

document.addEventListener('DOMContentLoaded', function() { game(); }, false);

var game = function() {

    var controller = new GameController();
    window.addEventListener('resize', debounce(function() { controller.resize(); }, 250) );
    controller.loadView();
    controller.resize();

    var hz = 60;
    var fps = round(1000 / hz);
    var min = 1;
    
    var af = false;
    if (af) runAnimationFrame(timestamp());
    else runTimeout();

    function runTimeout() {

        var before = timestamp();
        controller.run(before);
        var after = timestamp();
        var delta = round(after - before);
        var solid = delta <= fps;
        var delay = fps - delta || min;
        var timeout = solid ? delay : min;

        window.setTimeout(runTimeout, timeout);
    }
    
    
    function runAnimationFrame(now) {
        controller.run(now);
        window.requestAnimFrame(runAnimationFrame);
    }


    function resize() {
        if (controller) controller.resize();
    }
}