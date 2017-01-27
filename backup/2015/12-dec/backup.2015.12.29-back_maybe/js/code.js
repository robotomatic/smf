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

    window.addEventListener('resize', debounce(function() { resize(); }, 250) );

    var controller = new GameController();
    controller.loadView();
    run();
    resize();

    function run() {
        controller.run();
        
//        window.setTimeout(run, 1000 / 60);
        requestAnimFrame(run);
    }


    function resize() {
        if (controller) controller.resize();
    }
}