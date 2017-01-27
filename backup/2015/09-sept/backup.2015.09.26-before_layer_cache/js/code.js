(function(){
    
    loadView();
    
    function loadView() {
        if (window.location.hash) {
            var hash = window.location.hash.replace("#", "");
            loadAjax("views/"+hash, function(data) {
                document.getElementById("main").innerHTML = data;
                startGame();
            });
        } else {
            loadAjax("views/menu.html", function(data) {
                document.getElementById("main").innerHTML = data;
                loadMenu();
            });
        }
    }
    
    function loadMenu() {
        var buttons = document.getElementsByClassName('loader');
        for (var i = 0; i < buttons.length; i++){
            buttons[i].onclick = function(){ 
                var href = this.getAttribute("href");
                loadAjax("views/" + href, function(data) {
                    window.location.hash = href;
                    document.getElementById("main").innerHTML = data;
                    startGame();
                });
                return false;
            };
        }    
    }
    
    window.onpopstate=function() {
        loadView();
    }    
}());
