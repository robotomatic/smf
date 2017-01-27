var game;
var running;

window.addEventListener('resize', debounce(function() { resize(); }, 250) );

function startGame() {
    game = new GameLoop();
    loadGame("dat/levels/level1.json",
             "dat/items.json",
             "dat/players.json", 
             "dat/characters.json", 
             "dat/animations.json");
    running = true;
    run();
}

function stopGame() {
    running = false;
}

function run() { 
    if (!running) return;
    game.run(); 
    requestAnimationFrame(run);
}

function resize() {
    if (document.getElementsByClassName("auto").length) {
        var elem = document.getElementsByClassName("auto");
        for (var i = 0; i < elem.length; i++) {
            elem[i].style.height = window.innerHeight + "px";
            elem[i].style.width = window.innerWidth + "px";
        }
    }
    if (game) game.resize(); 
}

function showError(error) {
    alert(error.responseText);
}

function loadGame(levelfile, itemsfile, playersfile, charfile, animfile) {
    loadJSON(levelfile, function(data){
        var level = new Level();
        game.loadLevel(level.loadJson(data));
        loadItems(itemsfile, playersfile, charfile, animfile);
    }, function(data) {
        showError(data)
    });
}

function loadItems(itemsfile, playersfile, charfile, animfile) {
    loadJSON(itemsfile, function(data) {
        game.stage.level.setItemRenderer(new ItemRenderer(data));
        loadPlayers(playersfile, charfile, animfile);
    }, function(data) {
        showError(data)
    });
}

function loadPlayers(file, charfile, animfile) {
    loadJSON(file, function(data){

        var players = new Players().loadJson(data);
        game.loadPlayers(players);

        var input = new Input();
        document.body.addEventListener("keydown", function (e) { input.keyEvent(e.keyCode, true); });
        document.body.addEventListener("keyup", function (e) { input.keyEvent(e.keyCode, false); });

        // todo: add this to json config somewhere...
        input.mapPlayerKeys(players[0], {87: "jump", 65: "left", 68: "right"});
        input.mapPlayerKeys(players[1], {38: "jump", 37: "left", 39: "right"});
        input.mapPlayerKeys(players[6], {80: "jump", 76: "left", 222: "right"});
        input.mapPlayerKeys(players[3], {104: "jump", 100: "left", 102: "right"});
        input.mapPlayerKeys(players[4], {89: "jump", 71: "left", 74: "right"});

        loadCharacters(charfile, animfile, players);
        loadViews(players);

    }, function(data) {
        showError(data)
    });
}

function loadCharacters(file, animfile, players) {
    loadJSON(file, function(data){
        var characters = new Characters().loadJson(data);
        loadAnimations(animfile, characters, players);
    }, function(data) {
        showError(data)
    });
}

function loadAnimations(file, chars, players) {
    loadJSON(file, function(data){
        var animations = new Animations().loadJson(data);
        for (var i = 0; i < chars.length; i++) {
            var character = chars[i];
            var charanims = new Array();
            for (var a in character.animations) charanims[character.animations[a]] = animations[character.animations[a]];
            character.setAnimator(new CharacterAnimator(charanims));
            character.setRenderer(new CharacterRenderer());
            if (players[i]) players[i].setCharacter(character);
        }
    }, function(data) {
        showError(data)
    });
}

function loadViews(players) {
    var views;
    var z = 5;
    var w = 1200, h = 600;
    if (document.getElementById("stage-canvas")) views = new Array(new StageView("stage-canvas", new DevTools()));
    else {
        var t = document.getElementsByClassName("camera-canvas");
        if (t.length == 1) {
            if (t[0].classList.contains('player-canvas')) {
                var id = t[0].id;
                var player = players[0];
                for (var i = 0; i < players.length; i++) {
                    if (players[i].name == id) {
                        player = players[i];
                        break;
                    }
                }
                views = new Array(new PlayerView(id, player, w, h, z, new DevTools()));
            } else views = new Array(new GameView("camera-canvas-1", players, w, h, new DevTools()));
        }
    }
    game.loadViews(views);
    resize();
}