(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
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

function collide(shapeA, shapeB) {
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null,
        colAmt = 0;
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            colAmt = oY;
            if (vY >= 1 && shapeB.collide != "top") colDir = "t";
            else if (vY <= 1) {
                 if (shapeB.collide == "top") {
                     if (shapeA.velY >= 0) colDir = "b";
                 } else colDir = "b";
            }
        } else if (shapeB.collide != "top") {
            colAmt = oX;
            if (vX >= 1) colDir = "l";
            else if (vX <= 1) colDir = "r";
        }
    }
    return {"direction" : colDir, "amount" : colAmt};
}

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
        if (!minx || items[i].x <= minx) minx = items[i].x;
        if (!miny || items[i].y <= miny) miny = items[i].y;
        if (!maxx || items[i].x + items[i].width >= maxx) maxx = items[i].x + items[i].width;
        if (!maxy || items[i].y + items[i].height >= maxy) maxy = items[i].y + items[i].height;
    }
    return {"x" : minx - (pad / 2), "y" : miny - (pad / 2), "width" : maxx - minx + pad, "height" : maxy - miny + pad};
}

function clearRect(ctx, x, y, width, height) { ctx.clearRect(roundInt(x), roundInt(y), roundInt(width), roundInt(height)); }
function drawRect(ctx, x, y, width, height) { ctx.fillRect(roundInt(x), roundInt(y), roundInt(width), roundInt(height)); }
function drawImage(image, ctx, x, y, width, height) { 
    ctx.fillRect(roundInt(x), roundInt(y), roundInt(width), roundInt(height)); 
}

function roundInt(num) { 
    return num; 
    //return ~~ (0.5 + num); 
}

function blurCanvas(buffer, ctx, offset) {
    ctx.globalAlpha = 0.3;
    for (var i = 1; i <= 3; i++) {
        ctx.drawImage(buffer, offset, 0, buffer.width-offset, buffer.height, 0, 0,buffer.width-offset, buffer.height);
        ctx.drawImage(buffer, 0, offset, buffer.width, buffer.height-offset, 0, 0,buffer.width, buffer.height-offset);
        ctx.drawImage(buffer, -offset, 0, buffer.width+offset, buffer.height, 0, 0,buffer.width+offset, buffer.height);
        ctx.drawImage(buffer, 0, -offset, buffer.width, buffer.height+offset, 0, 0,buffer.width, buffer.height+offset);
    }
};

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


function fadeIn(e) {
    e.className += " fade-in";
    e.className = e.className.replace(/\bfade-out\b/,'');
    e.className = e.className.replace(/\bfade-hide\b/,'');
}

function fadeOut(e) {
    e.className = e.className.replace(/\bfade-in\b/,'');
    e.className += " fade-out";
}
