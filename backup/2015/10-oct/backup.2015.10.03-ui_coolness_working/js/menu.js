//  todo: consolidate game and menu classes into game_controller class

var menuloop;
var menurunning;
var characters = null;
var charspace = 50;
var currentchar = 0;
var busy = false;

function startMenu() {
    menuloop = new GameLoop();
    loadMenu("dat/menu.json",
             "dat/characters.json", 
             "dat/animations.json");
}

function positionButtons() {
    var prev = document.getElementById("menu-game-player-view-player-button-prev");
    if (prev) positionElement(prev);
    var next = document.getElementById("menu-game-player-view-player-button-next");
    if (next) positionElement(next);
}

function showPrevCharacter() {
    if (busy) return;
    busy = true;
    var m = document.getElementById("menu-canvas-text");
    fadeOutFast(m);
    var keys = Object.keys(characters);
    var total = keys.length - 1;
    if (currentchar == 0) {
        var movedchars = 0;
        for (var i = 1; i <= total; i++) {
            menuloop.stage.npcs.npcs[i].doAction("moveTo", { "x" : -(charspace * (total + 1)) }, "", null, function() {
                if (movedchars++ == total - 1) {
                    menuloop.doAction("right", true, "x", charspace, function() { 
                        menuloop.stage.npcs.npcs[0].doAction("moveTo", { "x" : -(charspace * (total + 1)) }, "", null, function() {
                            currentchar = total;
                            showCharacterName(); 
                            busy = false;
                            return;
                        });
                    });
                }
            });
        }
        return;
    }
    menuloop.doAction("right", true, "x", charspace, function() { 
        busy = false;
        currentchar--;
        showCharacterName(); 
    });
}

function showNextCharacter() {
    if (busy) return;
    busy = true;
    var m = document.getElementById("menu-canvas-text");
    fadeOutFast(m);
    var keys = Object.keys(characters);
    var total = keys.length - 1;
    if (currentchar == total) {
        var movedchars = 0;
        for (var i = 0; i < total; i++) {
            menuloop.stage.npcs.npcs[i].doAction("moveTo", { "x" : (charspace * (total + 1)) }, "", null, function() {
                if (movedchars++ == total - 1) {
                    menuloop.doAction("left", true, "x", -charspace, function() { 
                        menuloop.stage.npcs.npcs[total].doAction("moveTo", { "x" : (charspace * (total + 1)) }, "", null, function() {
                            currentchar = 0;
                            showCharacterName(); 
                            busy = false;
                            return;
                        });
                        currentchar = 0;
                        showCharacterName(); 
                        busy = false;
                        return;
                    });
                }
            });
        }
        return;
    }
    menuloop.doAction("left", true, "x", -charspace, function() { 
        busy = false;
        currentchar++;
        showCharacterName(); 
    });
}

function showCharacterName() {
    if (!characters) return;
    var m = document.getElementById("menu-canvas-text");
    if (!m) return;
    var p = m.parentNode;
    var pw = p.offsetWidth;
    var fs = Number(pw / 25);
    if (fs > 15) fs = 15;
    m.style.fontSize = fs + "px";
    var keys = Object.keys(characters);
    m.innerHTML = characters[keys[currentchar]].name;
    fadeInFast(m);
}

function stopMenu() {
    menurunning = false;
}

function menuRun() { 
    if (!menurunning) return;
    menuloop.run(); 
    requestAnimationFrame(menuRun);
}

function resizeMenu() {
    if (!menuloop) return;
    positionButtons();
    menuloop.resize(); 
    showCharacterName();
}

function loadMenu(levelfile, charfile, animfile) {
    loadJSON(levelfile, function(data){
        var level = new Level();
        menuloop.loadLevel(level.loadJson(data));
        loadMenuCharacters(charfile, animfile);
    }, function(data) {
        showError(data)
    });
}

function loadMenuCharacters(file, animfile) {
    loadJSON(file, function(data){
        characters = new Characters().loadJson(data);
        loadMenuAnimations(animfile, characters);
    }, function(data) {
        showError(data)
    });
}

function loadMenuAnimations(file, chars) {
    var players = new Players();
    var npcs = new NPCs();
    var mid = menuloop.stage.level.width / 2;
    var playerx = mid - (currentchar * charspace); 
    loadJSON(file, function(data){
        var animations = new Animations().loadJson(data);
        for (var charname in chars) {
            var character = chars[charname];
            var charanims = new Array();
            for (var a in character.animations) charanims[character.animations[a]] = animations[character.animations[a]];
            character.setAnimator(new CharacterAnimator(charanims));
            character.setRenderer(new CharacterRenderer());
            var pw = character.width ? character.width : 20;
            var ph = character.height ? character.height : 25;
            var pdiff = (20 - pw) / 2;
            var player = new Player(character.name, "", playerx + pdiff, 500, pw, ph, 1, character);
            player.lookThreshold = .1;
            players.addPlayer(player);
            var npc = new NPC(player);
            npcs.addNPC(npc);
            playerx += charspace;
        }
        menuloop.loadPlayers(players.getPlayers());
        menuloop.loadNPCs(npcs);
        loadMenuView();
    }, function(data) {
        showError(data)
    });
}

function loadMenuView() {
    var views;
    var menubox = {
        "x" : 5000,
        "y" : 600,
        "width" : 20,
        "height" : 25
    }
    var z = 20;
    var w = 1200, h = 600;
    if (document.getElementById("menu-canvas")) {
        var view = new MenuView("menu-canvas", menubox, w, h, z);
        views = new Array(view);
    }
    menuloop.hideViews();
    menuloop.loadViews(views);
    loadMenuUI();
}

function loadMenuUI() {
    if (!menuloop)  return;
    loadAjax("views/ui_menu.html", function(data) {
        if (menuloop && menuloop.stage && menuloop.stage.views) for (var i = 0; i < menuloop.stage.views.length; i++) menuloop.stage.views[i].setUI(new UI(data));
        showCharacterName();
        loadMenuDevTools();
    });
}

function loadMenuDevTools() {
    if (!menuloop)  return;
    loadAjax("views/ui_dev.html", function(data) {
        if (menuloop && menuloop.stage && menuloop.stage.views) for (var i = 0; i < menuloop.stage.views.length; i++) menuloop.stage.views[i].setDevTools(new DevTools(data));
        resizeMenu();
        menuloop.showViews();
        menurunning = true;
        menuRun();
        showCharacterName();
    });
}



