"use strict";

var fov = 400;
var pad = 20;

function shouldProject(p1, p2, scale, x, y, width, height, wc, cp) {

    var w = (wc.x - x) * scale;
    var h = (wc.y - y - pad) * scale;

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

function project3D(p1, p2, depth, poly, width, height, s, x, y, wc, np1, np2) {

    var scale = fov / (fov + depth);
    var inv = 1.0 - scale;

    var w = (wc.x - x) * s;
    var h = (wc.y - y - pad) * s;
    
    var np1x = (p1.x * scale) + (w * inv);
	var np1y = (p1.y * scale) + (h * inv);   
    var np2x = (p2.x * scale) + (w * inv);
	var np2y = (p2.y * scale) + (h * inv);    

    np1x = round(np1x);
	np1y = round(np1y);   
    np2x = round(np2x);
	np2y = round(np2y);    
    
    np1.x = np1x;
    np1.y = np1y;
    np2.x = np2x;
    np2.y = np2y;

    poly.points.length = 0;
    poly.addPoint(np1);
    poly.addPoint(np2);
    poly.addPoint(p2);
    poly.addPoint(p1);
    
    return poly;
}

function projectPoint3D(p1, depth, s, x, y, wc, np1) {

    var scale = fov / (fov + depth);
    var inv = 1.0 - scale;

    var w = (wc.x - x) * s;
    var h = (wc.y - y - pad) * s;
    
    var np1x = (p1.x * scale) + (w * inv);
	var np1y = (p1.y * scale) + (h * inv);   

    np1.x = round(np1x);
    np1.y = round(np1y);
    
    return np1;
}
