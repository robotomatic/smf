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

//    goFullScreen();
    
    var controller = new GameController();
    window.addEventListener('resize', debounce(function() { controller.resize(); }, 250) );
    controller.loadView();
    controller.resize();
    run();

    function run() {
        
        var now = timestamp();
        controller.run(now);
        var after = timestamp();
        
        var delta = after - now;
        
        var hz = 60;
        var fps = 1000 / hz;
        
        var delay = fps - delta;
        var delay = delta < fps ? fps + (fps - delta) : fps - delta;
        var timeout = delay < 5 ? 5 : delay;
        
        window.setTimeout(run, timeout);
    }


    function resize() {
        if (controller) controller.resize();
    }
}