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
    return Math.round(num * 100) / 100;
}

function angleRadians(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function angleDegrees(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}