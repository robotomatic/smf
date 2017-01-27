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
    run();

    function run(now) {
        
        if (!now) now = timestamp();
        controller.run(now);
        
        var delay = 1000 / 60;
        delay = 10;
        
        window.setTimeout(run, delay);
//        requestAnimFrame(run);
    }


    function resize() {
        if (controller) controller.resize();
    }
}