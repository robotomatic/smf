document.addEventListener('DOMContentLoaded', function() { startGame(); }, false);
window.addEventListener('resize', debounce(function() { resize(); }, 250) );
window.onbeforeunload = function (e) { fadeOut(controller.element); };    

input = new Input();
document.body.addEventListener("keydown", function (e) { input.keyEvent(e.keyCode, true); });
document.body.addEventListener("keyup", function (e) { input.keyEvent(e.keyCode, false); });

var controller = null;

function startGame() {
    controller = new GameController();
    controller.loadView();
    run();
}

function run() {
    controller.run();
    requestAnimationFrame(run);
}

function resize() {
    resizeElements();
    controller.resize();
}
