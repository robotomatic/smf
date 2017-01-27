document.addEventListener('DOMContentLoaded', function() { startGame(); }, false);
window.addEventListener('resize', debounce(function() { resize(); }, 250) );
window.onbeforeunload = function (e) { fadeOut(controller.element); };    

var controller = null;

function startGame() {
    controller = new GameController("main");
    controller.loadView();
    run();
}

function run() { 
    if (controller.game && controller.game.loop) controller.game.loop.run(); 
    requestAnimationFrame(run);
}

function resize() {
    resizeElements();
    controller.resize();
}
