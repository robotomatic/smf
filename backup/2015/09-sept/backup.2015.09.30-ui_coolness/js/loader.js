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
            var hash = window.location.hash.replace("#", "");
            loadAjax("views/"+hash+".html", function(data) {
                showGame(data);
            });
        } else {
            if (!ignorefade) fadeOut(main);
            ignorefade = false;
            loadAjax("views/menu.html", function(data) {
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
                    showGame(data);
                });
                e.preventDefault();
                return false;
            };
        }    
    }
    function showGame(data) {
        main.innerHTML = data;
        resize();
        startGame();
        fadeIn(main);
        ignorefade = false;
    }
    function showMenu(data) {
        main.innerHTML = data;
        stopGame();
        loadMenu();
        resize();
        fadeIn(main);
        ignorefade = false;
    }
    resize = function() {
        if (document.getElementsByClassName("auto").length) {
            var elem = document.getElementsByClassName("auto");
            for (var i = 0; i < elem.length; i++) {
                elem[i].style.height = window.innerHeight + "px";
                elem[i].style.width = window.innerWidth + "px";
            }
        }
        resizeGame();
    }
    window.onpopstate=function() {
        if (!ignorepop) loadView();
        ignorepop = false;
    }    
}());