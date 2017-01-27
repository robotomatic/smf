// todo: get rid of iifie and run startGame() onLoad
//       combine game.js and menu.js into game_controller.js
//       move showMenu(), showGameMenu() and showGame() into game-controller.js

(function(){
    
    window.onbeforeunload = function (e) { fadeOut(main); };    
    window.addEventListener('resize', debounce(function() { resize(); }, 250) );
    
    var main = document.getElementById("main");
    var ignorepop = false;
    var ignorefade = true;
    
    loadView();
    
    function loadView() {
        if (window.location.hash) {
            if (!ignorefade) fadeOut(main);
            ignorefade = false;
            var hash = window.location.hash.replace(/#/g,'');
            loadAjax("views/"+hash+".html", function(data) {
                if (hash.indexOf("game") > -1) showGame(data);
                else showGameMenu(data);
            });
        } else {
            if (!ignorefade) fadeOut(main);
            ignorefade = false;
            loadAjax("views/menu-main.html", function(data) {
                showMenu(data);
            });
        }
    }
    function loadMenu() {
        var buttons = document.getElementsByClassName('loader');
        for (var i = 0; i < buttons.length; i++){
            buttons[i].onclick = function(e){ 
                fadeOut(main);
                ignorepop = true;
                var href = this.getAttribute("href");
                loadAjax("views/" + href + ".html", function(data) {
                    window.location.hash = href;
                    if (href.indexOf("game") > -1) showGame(data);
                    else showGameMenu(data);
                });
                e.preventDefault();
                return false;
            };
        }    
    }
    function loadGameMenu() {
        var prev = document.getElementById("menu-game-player-view-player-button-prev");
        if (prev) prev.onclick = function(e) {
            showPrevCharacter();
            e.preventDefault();
            return false;
        }
        var next = document.getElementById("menu-game-player-view-player-button-next");
        if (next) next.onclick = function(e) {
            showNextCharacter();
            e.preventDefault();
            return false;
        }
    }
    function showMenu(data) {
        stopMenu();
        stopGame();
        main.innerHTML = data;
        loadMenu();
        resize();
        fadeIn(main);
        ignorefade = false;
    }
    function showGameMenu(data) {
        stopMenu();
        stopGame();
        main.innerHTML = data;
        loadGameMenu();
        startMenu();
        resize();
        fadeIn(main);
        ignorefade = false;
    }
    function showGame(data) {
        stopMenu();
        stopGame();
        main.innerHTML = data;
        resize();
        startGame();
        fadeIn(main);
        ignorefade = false;
    }
    resize = function() {
        resizeElements();
        resizeMenu();
        resizeGame();
    }
    window.onpopstate=function() {
        if (!ignorepop) loadView();
        ignorepop = false;
    }
}());