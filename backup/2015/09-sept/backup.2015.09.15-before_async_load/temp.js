function loadLevel() {
    return new Level(level1.width, level1.height, level1.items)        
}

function loadPlayers() {
    var input = new Input();
    document.body.addEventListener("keydown", function (e) { input.keyEvent(e.keyCode, true); });
    document.body.addEventListener("keyup", function (e) { input.keyEvent(e.keyCode, false); });

    var player1 = new Player("red", 350, 70, 18, 26, 3.2);
    var player2 = new Player("blue", 460, 60, 20, 20, 3);
    var player3 = new Player("magenta", 700, 35, 10, 30, 3.5);
    player3.canDoublejump = true;
    var player4 = new Player("purple", 1000, 35, 15, 15, 3.5);
    player4.canFly = true;

    input.mapPlayerKeys(player1, {87: "jump", 65: "left", 68: "right"});
    input.mapPlayerKeys(player2, {38: "jump", 37: "left", 39: "right"});
    input.mapPlayerKeys(player3, {80: "jump", 76: "left", 222: "right"});
    input.mapPlayerKeys(player4, {104: "jump", 100: "left", 102: "right"});

    return new Array(player1, player2, player3, player4);    
}    

function loadViews(players) {
    var w = 800, h = 400, z = 2;
    return new Array(new StageView("stage-canvas"),   
                     new PlayerView("camera-canvas-1", players[0], w, h, z),
                     new PlayerView("camera-canvas-2", players[1], w, h, z),
                     new PlayerView("camera-canvas-3", players[2], w, h, z),
                     new PlayerView("camera-canvas-4", players[3], w, h, z),
                     new GameView("camera-canvas-5", players, 1200, 800)
                    );
}
