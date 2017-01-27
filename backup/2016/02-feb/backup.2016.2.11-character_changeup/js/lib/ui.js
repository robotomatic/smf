function showError(error) {
    // todo
    alert(error.responseText);
}

function showSlide(e) {
    if (!e || !e.className) return;
    e.className = e.className.replace(/slide-hide/g, '');
}

function hideSlide(e) {
    if (!e || !e.className) return;
    e.className += " slide-hide";
}

function clearFade(e) {
    if (!e || !e.className) return;
    e.className = e.className.replace(/\bfade-out-fast\b/,'');
    e.className = e.className.replace(/\bfade-out\b/,'');
    e.className = e.className.replace(/\bfade-hide\b/,'');
    e.className = e.className.replace(/\bfade-in-fast\b/,'');
    e.className = e.className.replace(/\bfade-in-slow\b/,'');
    e.className = e.className.replace(/\bfade-in\b/,'');
}

function fadeIn(e) {
    if (!e) return;
    clearFade(e);
    if (e.className) e.className += " ";
    e.className += "fade-in";
}

function fadeOut(e) {
    if (!e) return;
    clearFade(e);
    if (e.className) e.className += " ";
    e.className += "fade-out";
}

function fadeOutHide(e) {
    if (!e) return;
    clearFade(e);
    if (e.className) e.className += " ";
    e.className += "fade-out fade-hide";
}

function fadeInSlow(e) {
    if (!e) return;
    clearFade(e);
    if (e.className) e.className += " ";
    e.className += "fade-in-slow";
}

function fadeInFast(e) {
    if (!e) return;
    clearFade(e);
    if (e.className) e.className += " ";
    e.className += "fade-in-fast";
}

function fadeOutFast(e) {
    if (!e) return;
    clearFade(e);
    if (e.className) e.className += " ";
    e.className += "fade-out-fast";
}

function fadeOutHideFast(e) {
    if (!e) return;
    clearFade(e);
    if (e.className) e.className += " ";
    e.className += " fade-out-fast fade-hide";
}

function resizeElements() {
    if (document.getElementsByClassName("auto").length) {
        var elem = document.getElementsByClassName("auto");
        for (var i = 0; i < elem.length; i++) {
            elem[i].style.height = window.innerHeight + "px";
            elem[i].style.width = window.innerWidth + "px";
        }
    }
    if (document.getElementsByClassName("fit-height").length) {
        var elem = document.getElementsByClassName("fit-height");
        for (var i = 0; i < elem.length; i++) {
            elem[i].style.height = window.innerHeight + "px";
        }
    }
    if (document.getElementsByClassName("ui-height").length) {
        var elem = document.getElementsByClassName("ui-height");
        for (var i = 0; i < elem.length; i++) {
            var uih = elem[i].getAttribute("ui-height");
            if (uih) {
                uih -= uih *.02;
                var nh = window.innerHeight * (uih / 100); 
                elem[i].style.height = nh + "px";
            }
        }
    }
    if (document.getElementsByClassName("ui-top").length) {
        var elem = document.getElementsByClassName("ui-top");
        for (var i = 0; i < elem.length; i++) {
            var tp = elem[i].getAttribute("ui-top");
            if (tp) {
                var p = findParent(elem[i], "ui-top-parent");
                if (!p) elem[i].parentNode;
                var pt = p.offsetHeight;
                var nt = pt * (tp / 100); 
                elem[i].style.marginTop = nt + "px";
            }
        }
    }
    
}

function findParent (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function isFullscreen() {
    return (window.navigator.standalone || 
        (document.fullScreenElement && document.fullScreenElement != null) || 
        (document.mozFullScreen || document.webkitIsFullScreen) || 
        (!window.screenTop && !window.screenY));    
}

function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {  
            document.documentElement.requestFullScreen();  
        } else if (document.documentElement.mozRequestFullScreen) {  
            document.documentElement.mozRequestFullScreen();  
        } else if (document.documentElement.webkitRequestFullScreen) {  
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
        }  
    } else {  
        if (document.cancelFullScreen) {  
            document.cancelFullScreen();  
        } else if (document.mozCancelFullScreen) {  
            document.mozCancelFullScreen();  
        } else if (document.webkitCancelFullScreen) {  
            document.webkitCancelFullScreen();  
        }  
    }  
}