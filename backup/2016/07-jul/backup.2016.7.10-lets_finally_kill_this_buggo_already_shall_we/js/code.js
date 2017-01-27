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


var controller;


var game = function() {

    controller = new GameController();
    window.addEventListener('resize', debounce(function() { controller.resize(); }, 250) );
    controller.loadView();
    controller.resize();

    var hz = 60;
    var fps = round(1000 / hz);
    var min = 1;
    
    var af = true;
    if (af) runAnimationFrame(timestamp());
    else runTimeout();

    function runTimeout() {

        var before = timestamp();
        
        console.log(before);
        
        controller.run(before);
        var after = timestamp();
        var delta = round(after - before);
        var solid = delta <= fps;
        var delay = fps - delta || min;
        var timeout = solid ? delay : min;
        
        
        console.log(after);
        console.log("**********************************" + delta + "**********************************");

        window.setTimeout(runTimeout, timeout);
    }
    
    


    function resize() {
        if (controller) controller.resize();
    }
}

function runAnimationFrame(when) {
    var before = timestamp();

//        console.log(before);

    controller.run(before);
    var after = timestamp();
    var delta = round(after - before);

//        console.log(after);
//        console.log("**********************************" + delta + "**********************************");

    window.requestAnimFrame(runAnimationFrame);
}
