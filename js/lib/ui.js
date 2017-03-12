"use strict";


function isMobile() {
    var d = document.getElementById("mobile");
    var s = getStyle(d, "display");
    return s != "none";
}

function isTablet() {
    var d = document.getElementById("tablet");
    var s = getStyle(d, "display");
    return s != "none";
}

function isDesktop() {
    var d = document.getElementById("desktop");
    var s = getStyle(d, "display");
    return s != "none";
}


function getStyle(el, property) {
    if ( window.getComputedStyle ) return document.defaultView.getComputedStyle(el,null)[property];
    if ( el.currentStyle ) return el.currentStyle[property];
}



function show(e) {
    if (!e || !e.className) return;
    e.className = e.className.replace(/\bhidden\b/,'');
}

function hide(e) {
    if (!e || !e.className) return;
    if (e.className.indexOf("hidden") > -1) return;
    e.className += " hidden";
}


function showError(error) {
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

function goFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {  
            document.documentElement.requestFullScreen();  
        } else if (document.documentElement.mozRequestFullScreen) {  
            document.documentElement.mozRequestFullScreen();  
        } else if (document.documentElement.webkitRequestFullScreen) {  
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
        }  
    }  
}




function findChildById(element, childid) {
    var child = null;
    var children = getAllDescendants(element);
    for (var i = 0; i < children.length; i++) {
        if (children[i].id == childid) {
            child = children[i];
            break;
        }
    }
    return child;
}

function getAllDescendants(element, children) {
    children = children ? children : [];
    var childnodes = element.childNodes;
    for (var i = 0; i < childnodes.length; i++) {
        if (childnodes[i].nodeType == 1) {
            children.push(childnodes[i]);
            children = getAllDescendants(childnodes[i], children);
        }
    }
    return children;
}