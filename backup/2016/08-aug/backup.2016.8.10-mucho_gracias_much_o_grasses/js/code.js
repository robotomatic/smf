'use strict';

(function() {
    var controller;
    var last = 0;
    var lastused = 0;
    
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
        log("-----------------------------------------------------------", "fps");
        console.timeStamp("runTimeout()");
        dumpMemory();
                
        var when = timestamp();
        var d = round(when - last);
        log(" === ", "fps");
        log("wait == " + d + (d < 50 ? "" : " <----------------------"), "fps");
        
        controller.run(when);

        var now = timestamp();
        var update = round(now - when);
        log("update = " + update + (update < 50 ? "" : " <-------"), "fps");

        controller.render(when);

        var after = timestamp();
        var render = round(after - now);
        log("render = " + render + (render < 50 ? "" : " <-------"), "fps");
        
        var delta = update + render;
        log("total = " + delta + (delta < 50 ? "" : " <-------"), "fps");

        dumpMemory();
        
        last = after;
        
        setZeroTimeout(runZero);
        console.timeStamp("after runTimeout()");
    }
    
    function runTimeout() {
        log("-----------------------------------------------------------", "fps");
        console.timeStamp("runTimeout()");
        dumpMemory();
                
        var when = timestamp();
        var d = round(when - last);
        log(" === ", "fps");
        log("wait == " + d + (d < 50 ? "" : " <----------------------"), "fps");
        
        controller.run(when);

        var now = timestamp();
        var update = round(now - when);
        log("update = " + update + (update < 50 ? "" : " <-------"), "fps");

        controller.render(when);

        var after = timestamp();
        var render = round(after - now);
        log("render = " + render + (render < 50 ? "" : " <-------"), "fps");
        
        var delta = update + render;
        log("total = " + delta + (delta < 50 ? "" : " <-------"), "fps");
        
        var solid = delta < fps;
        var delay = fps - delta;
        var timeout = solid ? delay : min;

        dumpMemory();
        
        last = after;
        
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
        log("-----------------------------------------------------------", "fps");
        console.timeStamp("runAnimationFrame()");
        dumpMemory();
                
        var d = round(when - last);
        log(" === ", "fps");
        log("wait == " + d + (d < 50 ? "" : " <----------------------"), "fps");
        
        controller.run(when);
        
        var now = timestamp();
        var update = round(now - when);
        log("update = " + update + (update < 50 ? "" : " <-------"), "fps");

        controller.render(when);

        var after = timestamp();
        var render = round(after - now);
        log("render = " + render + (render < 50 ? "" : " <-------"), "fps");
        
        var delta = update + render;
        log("total = " + delta + (delta < 50 ? "" : " <-------"), "fps");

        dumpMemory();
        
        last = after;
        
        window.requestAnimFrame(runAnimationFrame);
        console.timeStamp("after runTimeout()");
    }

    function dumpMemory() {
        var u = window.performance.memory.usedJSHeapSize;      
        var ud = u - lastused;
        var o = ud;
        var gc = ud < 0;
        if (gc) {
            o += " <================================================================================= GC";
            console.timeStamp("Garbage Collect --> " + ud);
        }
        lastused = u;
        if (gc) log(ud + " <======== GC!", "gc");
        log("----------------------", "memory");
        log("Used:  " + u, "memory");
        log("Delta:  " + o, "memory");
    }
    
    function log(message, what) {
        
        return;
        
        if (what == "new") return;
        if (what == "memory") return;
        if (what == "gc") return;
//        if (what == "fps") return;
        console.log(message);
    }
})();