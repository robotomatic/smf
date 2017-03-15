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
    benchmark("new game - start", "game");
    controller = new GameController();
    controller.loadView();
    controller.resize();
    benchmark("new game - end", "game");
    runAnimationFrame(timestamp());
}

function runAnimationFrame(when) {
    if (__dev) runAnimationFrameDev(when);
    else {
        controller.run(when);
        window.requestAnimFrame(runAnimationFrame);
    }
}

function runAnimationFrameDev(when) {
    try {
        controller.run(when);
        window.requestAnimFrame(runAnimationFrame);
    } catch (x) {
        StackTrace.fromError(x).then(function(stackframes) {
            var error = stackframes.map(function(sf) {
                return sf.toString();
            }).join('\n');
            logDev(error);
        });
    }
}