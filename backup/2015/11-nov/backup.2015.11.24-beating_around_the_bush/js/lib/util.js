function lerp(a,b,u) {
    return (1-u) * a + u * b;
};

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : Date.now().getTime();
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

function getViewWindow(canvas, width, height) {
    var vbox = {
        "x" : 0,
        "y" : 0,
        "width" : width, 
        "height" : height
    }
    return translateItem(canvas.width, canvas.height, vbox, width, height);
}

function translateItem(winwidth, winheight, item, width, height) {
    var d = 0;
    if (width > height) {
        d = winwidth / width;
        var t = height * d;
        if (t > winheight) d *= winheight / t;
    } else {
        d = winheight / height;
        var t = width * d;
        if (t > winwidth) d *= winwidth / t;
    }
    var dx = (winwidth - (width * d)) / 2;
    var dy = (winheight - (height * d)) / 2;
    var ox = (item.x + (dx / d)) * d;
    var oy = (item.y + (dy / d)) * d;
    return {"x" : ox, "y" : oy, "width" : item.width * d, "height" : item.height * d};
};

function translateRelative(item, dx, dy, zoom) {
    zoom = (zoom) ? zoom : 1;
    return {"x" : (item.x * zoom) + dx, "y" : (item.y * zoom) + dy, "width" : item.width * zoom, "height" : item.height * zoom};
}

function makeSquare(rect) {
    var out = {};
    if (rect.width > rect.height) {
        var d = rect.width - rect.height;
        out.height = rect.width;
        out.y = rect.y - (d / 2);
        out.width = rect.width;
        out.x = rect.x;
    } else {
        var d = rect.height - rect.width;
        out.width = rect.height;
        out.x = rect.x - (d /2);
        out.height = rect.height;
        out.y = rect.y;
    }
    return out;
}

function getMbr(items, pad) {
    if (!pad) pad = 0;
    var minx, miny, maxx, maxy;
    for (var i = 0; i < items.length; i++) {
        var item = (items[i].camerabox) ? items[i].camerabox : items[i];
        if (!minx || item.x <= minx) minx = item.x;
        if (!miny || item.y <= miny) miny = item.y;
        if (!maxx || item.x + item.width >= maxx) maxx = item.x + item.width;
        if (!maxy || item.y + item.height >= maxy) maxy = item.y + item.height;
    }
    return {"x" : minx - (pad / 2), "y" : miny - (pad / 2), "width" : maxx - minx + pad, "height" : maxy - miny + pad};
}

function roundInt(num) { 
    //return (0.5 + num) << 0;
    //return ~~ (0.5 + num); 
    return num; 
}

function clamp(num) { 
    return (0.5 + num) << 0;
}

function lightenColor(color, luminosity) {
	color = new String(color).replace(/[^0-9a-f]/gi, '');
	if (color.length < 6) {
		color = color[0]+ color[0]+ color[1]+ color[1]+ color[2]+ color[2];
	}
	luminosity = luminosity || 0;
	var newColor = "#", c, i, black = 0, white = 255;
	for (i = 0; i < 3; i++) {
		c = parseInt(color.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(black, c + (luminosity * white)), white)).toString(16);
		newColor += ("00"+c).substr(c.length);
	}
	return newColor; 
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function findPosition(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
	   curleft = obj.offsetLeft
	   curtop = obj.offsetTop
	   while (obj = obj.offsetParent) {
           curleft += obj.offsetLeft
           curtop += obj.offsetTop
       }
    }
    return {"x" : curleft, "y" : curtop};
}



function fadeToColor(rgbColor1, rgbColor2, ratio) {
    var color1 = rgbColor1.substring(4, rgbColor1.length - 1).split(','),
        color2 = rgbColor2.substring(4, rgbColor2.length - 1).split(','),
        difference,
        newColor = [];
    for (var i = 0; i < color1.length; i++) {
        difference = color2[i] - color1[i];
        newColor.push(Math.floor(parseInt(color1[i], 10) + difference * ratio));
    }
    return 'rgb(' + newColor + ')';
}



function angleRadians(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function angleDegrees(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}