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

function positionElements(elems) { for (var i = 0; i < elems.length; i++ ) positionElement(elems[i]); };

function positionElement(elem) {
    var linkelem = document.getElementById(elem.getAttribute("ui-item-link"));
    if (linkelem) {
        var linkpoint = elem.getAttribute("ui-item-link-point");
        if (linkpoint) {
            var lex = linkelem.offsetLeft;
            var ley = linkelem.offsetTop;
            var lew = linkelem.offsetWidth;
            var leh = linkelem.offsetHeight;

            var ew = elem.offsetWidth / 2;
            var eh = elem.offsetHeight / 2;

            lex -= ew;
            ley -= eh;

            if (linkpoint == "tl") {
                elem.style.left = lex + "px";
                elem.style.top = ley + "px";
            } else if (linkpoint == "tc") {
                elem.style.left = lex + (lew / 2) + "px";
                elem.style.top = ley + "px";
            } else if (linkpoint == "tr") {
                elem.style.left = (lex + lew) + "px";
                elem.style.top = ley + "px";
            } else if (linkpoint == "bl") {
                elem.style.left = lex + "px";
                elem.style.top = (ley + leh) + "px";
            } else if (linkpoint == "bc") {
                elem.style.left = lex + (lew / 2) + "px";
                elem.style.top = (ley + leh) + "px";
            } else if (linkpoint == "br") {
                elem.style.left = (lex + lew) + "px";
                elem.style.top = (ley + leh) + "px";
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