'use strict';

(function() {
    var controller;
    var last = 0;
    
    var hz = 60;
    var fps = round(1000 / hz);
    var min = 1;

    var timeouts = [];    
    var messageName = "zero-timeout-message";
    function setZeroTimeout(fn) {
        timeouts.push(fn);
        window.postMessage(messageName, "*");
    }    
    window.addEventListener("message", handleMessage, true);
    window.setZeroTimeout = setZeroTimeout;    
    function handleMessage(event) {
        if (event.source == window && event.data == messageName) {
            event.stopPropagation();
            if (timeouts.length > 0) {
                var fn = timeouts.shift();
                fn();
            }
        }
    }
 
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    document.addEventListener('DOMContentLoaded', function() { game(); }, false);
    window.addEventListener('resize', debounce(function() { if (controller) controller.resize(); }, 250) );

    function game() {
        log("game", "new");
        controller = new GameController();
        controller.loadView();
        controller.resize();
        
//        setZeroTimeout(runZero);
//        setTimeout(runTimeout, 1);
//        setTimeout(runTimeoutAnimation, 1);
        window.requestAnimFrame(runAnimationFrame);
    }

    function resize() {
        if (controller) controller.resize();
    }

    function runZero() {
        var when = timestamp();
        controller.run(when);
        controller.render(when);
        setZeroTimeout(runZero);
    }
    
    function runTimeout() {
        var when = timestamp();
        controller.run(when);
        controller.render(when);
        var after = timestamp();
        var render = round(after - now);
        var delta = update + render;
        var solid = delta < fps;
        var delay = fps - delta;
        var timeout = solid ? delay : min;
        window.setTimeout(runTimeout, timeout)
        console.timeStamp("after runTimeout()");
    }

    function runTimeoutAnimation() {
        var when = timestamp();
        controller.run(when);
        var now = timestamp();
        controller.render(now);
        var after = timestamp();
        var delta = round(after - when);
        var solid = delta < fps;
        var delay = fps - delta;
        var timeout = solid ? delay : min;
        window.setTimeout(runTimeout, timeout)
    }
    
    function runAnimationFrameRender(when) {
        controller.render(when);
    }

    function runAnimationFrame(when) {
        controller.run(when);
        controller.render(when);
        window.requestAnimFrame(runAnimationFrame);
    }

})();