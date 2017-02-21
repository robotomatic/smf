"use strict";

var DATE_NOW = new Date();    


function clearRect(ctx, x, y, width, height) { 
    ctx.clearRect(x, y, width, height); 
}

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function timestamp() {
    if (window.performance && window.performance.now) return window.performance.now();
    return DATE_NOW.getTime();
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