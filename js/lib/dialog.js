"use strict";

var dialogs = new Array();
var drag = false;
var target = null;

document.addEventListener('mousedown', function(e) {
    var tgt = e.target || e.srcElement;
    if (tgt.className.indexOf("dialog-drag") < 0) return true;
    var id = tgt.parentElement.id;
    if (!dialogs[id]) return;
    drag = true;
    target = id;
    dialogs[id].bringToTop();
    dialogs[id].dragStart(e);
//    e.stopPropagation()
//    e.preventDefault();
//    return false;
}, false);

document.addEventListener('mousemove', function(e) {
    if (!drag || !target || !dialogs[target]) return;
    dialogs[target].dragMove(e);
//    e.stopPropagation()
//    e.preventDefault();
//    return false;
}, false);

document.addEventListener('mouseup', function(e) {
    if (!target || !dialogs[target]) return;
    dialogs[target].dragEnd(e);
    drag = false;
    target= null;
//    e.stopPropagation()
//    e.preventDefault();
//    return false;
}, false);

function Dialog(id, d) {
    
    if (dialogs[id]) return;
    
    this.id = id;
    dialogs[id] = this;
    this.dialog = d;
    this.drag = false;
    this.top = d.style.top;
    this.left = d.style.left;
    this.moved = false;
    this.dx = 0;
    this.dy = 0;
    this.mx = 0;
    this.my = 0;
    var c = this;
    this.bringToTop();
    this.reset = function() {
        c.dx = 0;
        c.dy = 0;
        c.drag = false;
        c.moved = false;
    }
    
    if (d.className.indexOf("dialog-resize") > -1) {
        d.addEventListener('mousemove', function(e) {
            var l = c.dialog.offsetLeft + c.dialog.offsetWidth - 10;
            var t = c.dialog.offsetTop + c.dialog.offsetHeight - 10;
            var x = document.all ? window.event.clientX : e.pageX;
            var y = document.all ? window.event.clientY : e.pageY;    
            if (x > l && y > t) if (c.dialog.className.indexOf("pointer-resize") < 0) c.dialog.className += " pointer-resize";
            else c.dialog.className = c.dialog.className.replace(" pointer-resize", "");
        });
        d.addEventListener('mouseout', function(e) {
            c.dialog.className = c.dialog.className.replace(" pointer-resize", "");            
        });
    }
    
    d.addEventListener('click', function(e) {
        c.bringToTop();
//        e.stopPropagation()
//        e.preventDefault();
//        return false;
    });
    var close = d.getElementsByClassName("dialog-title-close");
    if (close.length) {
        var cc = close[0];
        cc.addEventListener('click', function(e) {
            if (!d.className.indexOf("hidden") > -1) d.className += " hidden";
//            e.stopPropagation()
//            e.preventDefault();
//            return false;
        });
    }
}

Dialog.prototype.bringToTop = function() {
    var keys = Object.keys(dialogs);
    for (var i = 0; i < keys.length; i++) dialogs[keys[i]].dialog.style.zIndex -= 1;
    this.dialog.style.zIndex = 999;
}
    
Dialog.prototype.dragStart = function(e) {
    this.dx = this.dialog.offsetLeft;
    this.dy = this.dialog.offsetTop;
    this.mx = document.all ? window.event.clientX : e.pageX;
    this.my = document.all ? window.event.clientY : e.pageY;    
    this.drag = true;
}

Dialog.prototype.dragMove = function(e) {
    if (!this.drag) return;
    var x = document.all ? window.event.clientX : e.pageX;
    var y = document.all ? window.event.clientY : e.pageY;    
    var cx = this.dx + x - this.mx;
    var cy = this.dy + y - this.my;
    this.dialog.style.left = cx + "px";
    this.dialog.style.top = cy + "px";
}

Dialog.prototype.dragEnd = function(e) {
    this.drag = false;
    this.moved = true;
}