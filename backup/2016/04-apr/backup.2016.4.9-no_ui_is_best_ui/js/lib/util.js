"use strict";

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

function getMbr(items, pad, box) {
    if (!pad) pad = 0;
    var minx, miny, maxx, maxy;
    if (items.length) {
        for (var i = 0; i < items.length; i++) {
            var item = (items[i].camerabox) ? items[i].camerabox : items[i];
            if (!minx || item.x <= minx) minx = item.x;
            if (!miny || item.y <= miny) miny = item.y;
            if (!maxx || item.x + item.width >= maxx) maxx = item.x + item.width;
            if (!maxy || item.y + item.height >= maxy) maxy = item.y + item.height;
        }
    } else {
        var item = (items.camerabox) ? items.camerabox : items;
        minx = item.x;
        miny = item.y;
        maxx = item.x + item.width;
        maxy = item.y + item.height;
    }
    if (box) {
        box.x = minx - (pad / 2);
        box.y = miny - (pad / 2);
        box.width = maxx - minx + pad;
        box.height = maxy - miny + pad;
    } else box = new Rectangle(minx - (pad / 2), miny - (pad / 2), maxx - minx + pad, maxy - miny + pad);
    return box;
}