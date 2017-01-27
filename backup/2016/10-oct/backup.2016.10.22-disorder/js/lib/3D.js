"use strict";

var __fov = 400;

function getFOV() {
    return __fov;
}


function setFOV(f) {
    __fov = f;
}

function shouldProject(p1, p2, scale, x, y, wc, cp) {
    var w = (wc.x - x) * scale;
    var h = (wc.y - y) * scale;
    cp.x = w;
    cp.y = h;
    var horiz = p1.y == p2.y;
    var top = p1.x < p2.x;
    var vert = p1.x == p2.x;
    var left = p1.y > p2.y;
    var dt = p1.y >= cp.y;
    var dl = p1.x > cp.x;
    if (horiz && ((dt && !top) || (!dt && top))) return false;
    else if (vert && ((dl && !left) || (!dl && left))) return false;
    else return true;
}

function project3D(p1, p2, depth, poly, s, x, y, wc, np1, np2) {
    var w = (wc.x - x) * s;
    var h = (wc.y - y) * s;
    var np1x = projectPoint3DCoord(p1.x, depth, w);
	var np1y = projectPoint3DCoord(p1.y, depth, h);
    var np2x = projectPoint3DCoord(p2.x, depth, w);
	var np2y = projectPoint3DCoord(p2.y, depth, h);
    np1.x = round(np1x);
    np1.y = round(np1y);
    np2.x = round(np2x);
    np2.y = round(np2y);
    poly.points.length = 0;
    poly.addPoint(np1);
    poly.addPoint(np2);
    poly.addPoint(p2);
    poly.addPoint(p1);
    return poly;
}

function projectRectangle3D(rect, depth, s, x, y, wc) {
    var w = (wc.x - x) * s;
    var h = (wc.y - y) * s;
    var rx = rect.x;
    var ry = rect.y;
    rect.x = projectPoint3DCoord(rx, depth, w);
	rect.y = projectPoint3DCoord(ry, depth, h);
    var d = rect.height / rect.width;
    var wx = projectPoint3DCoord(rx + rect.width, depth, w);
    rect.width = wx - rect.x;
    rect.height = rect.width * d;
    return rect;
}

function projectPoint3D(p1, depth, s, x, y, wc, np1) {
    var w = (wc.x - x) * s;
    var h = (wc.y - y) * s;
    var np1x = projectPoint3DCoord(p1.x, depth, w);
	var np1y = projectPoint3DCoord(p1.y, depth, h);
    np1.x = round(np1x);
    np1.y = round(np1y);
    return np1;
}
    
function projectPoint3DCoord(p, depth, d) {
    
    var fd = __fov + depth;
    
    var scale = __fov / fd;
    var inv = 1.0 - scale;

    var ps = p * scale;
    var di = d * inv;

    var pp = ps + di;
    return pp;
}
    
