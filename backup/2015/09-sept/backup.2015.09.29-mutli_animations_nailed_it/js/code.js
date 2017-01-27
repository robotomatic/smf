(function(){
    var ignorepop = false;
    loadView();
    function loadView() {
        if (window.location.hash) {
            var hash = window.location.hash.replace("#", "");
            loadAjax("views/"+hash+".html", function(data) {
                document.getElementById("main").innerHTML = data;
                startGame();
            });
        } else {
            loadAjax("views/menu.html", function(data) {
                document.getElementById("main").innerHTML = data;
                stopGame();
                loadMenu();
            });
        }
    }
    function loadMenu() {
        var buttons = document.getElementsByClassName('loader');
        for (var i = 0; i < buttons.length; i++){
            buttons[i].onclick = function(e){ 
                ignorepop = true;
                var href = this.getAttribute("href");
                loadAjax("views/" + href + ".html", function(data) {
                    document.getElementById("main").innerHTML = data;
                    window.location.hash = href;
                    startGame();
                });
                e.preventDefault();
                return false;
            };
        }    
    }
    window.onpopstate=function() {
        if (!ignorepop) loadView();
        ignorepop = false;
    }    
}());
