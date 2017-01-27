function copyArray(a) {
    var out = new Array();
    var keys = Object.keys(a);
    for (var i = 0; i < keys.length; i++) out[keys[i]] = a[keys[i]];
    return out;
}

function lerp(a,b,u) {
    
    
    
    var d = b - a;
    
    
    //return a + d;
    
    return a + (u * d);
    
    //return b * u;
    
    return (1 - u) * a + u * b;
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

function getViewWindow(canvas, width, height, box) {
    if (box) {
        box.x = 0;
        box.y = 0;
        box.width = width;
        box.height = height;
    } else box = new Rectangle(0, 0, width, height);
    return translateItem(canvas.width, canvas.height, box, width, height);
}

function translateItem(winwidth, winheight, box, width, height) {
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
    var ox = (box.x + (dx / d)) * d;
    var oy = (box.y + (dy / d)) * d;
    
//    var out = new Rectangle(ox, oy, box.width * d, box.height * d);
//    return out;
    box.x = ox;
    box.y = oy;
    box.width = box.width * d;
    box.height = box.height * d;
    return box;
};

function translateRelative(item, dx, dy, zoom) {
    zoom = (zoom) ? zoom : 1;
    var r = new Rectangle((item.x * zoom) + dx, (item.y * zoom) + dy, item.width * zoom, item.height * zoom);
    return r;
}

function sortByPositionX(a, b){
    if (a.x == b.x) return a.y - b.y;
    return a.x - b.x;
}

function sortByPositionY(a, b){
    if (a.y == b.y) return a.x - b.x;
    return a.y - b.y;
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

function getMbr(items, pad, box) {
    if (!pad) pad = 0;
    var minx, miny, maxx, maxy;
    for (var i = 0; i < items.length; i++) {
        var item = (items[i].camerabox) ? items[i].camerabox : items[i];
        if (!minx || item.x <= minx) minx = item.x;
        if (!miny || item.y <= miny) miny = item.y;
        if (!maxx || item.x + item.width >= maxx) maxx = item.x + item.width;
        if (!maxy || item.y + item.height >= maxy) maxy = item.y + item.height;
    }
    if (box) {
        box.x = minx - (pad / 2);
        box.y = miny - (pad / 2);
        box.width = maxx - minx + pad;
        box.height = maxy - miny + pad;
    } else box = new Rectangle(minx - (pad / 2), miny - (pad / 2), maxx - minx + pad, maxy - miny + pad);
    return box;
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