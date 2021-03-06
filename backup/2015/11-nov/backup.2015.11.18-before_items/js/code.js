(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

document.addEventListener('DOMContentLoaded', function() { startGame(); }, false);
window.addEventListener('resize', debounce(function() { resize(); }, 250) );

input = new Input();
document.body.addEventListener("keydown", function (e) { input.keyEvent(e.keyCode, true); });
document.body.addEventListener("keyup", function (e) { input.keyEvent(e.keyCode, false); });

var controller = null;

function startGame() {
    resize();
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
    if (controller) controller.resize();
}