"use strict";

function clearRect(ctx, x, y, width, height) { 
    ctx.clearRect(x, y, width, height); 
}

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function timestamp() {
    if (window.performance && window.performance.now) return window.performance.now();
    var now = new Date();    
    return now.getTime();
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


function project3D(p1, p2, depth, poly, width, height, s) {

    var fov = 500 / s;
    
    var scale = fov / (fov + depth);
    var inv = 1.0 - scale;

    
    var w = width / 2;
    var h = height / 2;
    
    var np1x = (p1.x * scale) + (w * inv);
	var np1y = (p1.y * scale) + (h * inv);   
    var np2x = (p2.x * scale) + (w * inv);
	var np2y = (p2.y * scale) + (h * inv);    

    var np1 = new Point(np1x, np1y);
    var np2 = new Point(np2x, np2y);

    poly.points.length = 0;
    poly.addPoint(np1);
    poly.addPoint(np2);
    poly.addPoint(p2);
    poly.addPoint(p1);
    
    return poly;
}
