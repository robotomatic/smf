function lerp(a, b, u) {
    var d = b - a;
    return a + (u * d);
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(num) { 
    return (0.5 + num) << 0;
}

function round(num) { 
    return Math.round(num * 1000) / 1000;
}

function angleRadians(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function angleDegrees(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt( ( x2 -= x1 ) * x2 + ( y2 -= y1 ) * y2 );
}

