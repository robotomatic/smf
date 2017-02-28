'use strict';

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var controller;
window.addEventListener('resize', debounce(function() { if (controller) controller.resize(); }, 250) );
document.addEventListener('DOMContentLoaded', function() { game(); }, false);

function game() {
    log("game", "new");
    controller = new GameController();
    controller.loadView();
    controller.resize();
    runAnimationFrame(timestamp());

}

function runAnimationFrame(when) {
    controller.run(when);
    var now = timestamp();
    controller.render(now);
    window.requestAnimFrame(runAnimationFrame);
}