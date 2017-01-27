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
    run();

    var resize = false;
    function run() {
        if (!resize) controller.resize();
        resize = true;
        controller.run();
        
//        window.setTimeout(run, 1000 / 60);
        requestAnimFrame(run);
    }


    function resize() {
        if (controller) controller.resize();
    }
}