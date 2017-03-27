
var MATH_RANDOM = Math.random;
var MATH_PI = Math.PI;
var MATH_FLOOR = Math.floor;
var MATH_ROUND = Math.round;
var MATH_ATAN = Math.atan2;
var MATH_SQRT = Math.sqrt;
var MATH_ABS = Math.abs;
var MATH_POW = Math.pow;
var MATH_MIN = Math.min;
var MATH_MAX = Math.max;
var MATH_COS = Math.cos;
var MATH_SIN = Math.sin;


function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function lerp(a, b, u) {
    var d = b - a;
    return a + (u * d);
}

function random(min, max) {
    if (min == undefined || max == undefined) return MATH_RANDOM();
    return MATH_FLOOR(MATH_RANDOM() * (max - min + 1)) + min;
}

function sqrt(num) { 
    return MATH_SQRT(num);
}

function abs(num) { 
    return MATH_ABS(num);
}

function pow(num, p) { 
    return MATH_POW(num, p);
}

function min(num1, num2) { 
    return MATH_MIN(num1, num2);
}

function max(num1, num2) { 
    return MATH_MAX(num1, num2);
}

function cos(num) { 
    return MATH_COS(num);
}

function sin(num) { 
    return MATH_SIN(num);
}

function atan(num) { 
    return MATH_ATAN(num);
}

function floor(num) { 
    return MATH_FLOOR(num);
}

function clamp(num) { 
    return (0.5 + num) << 0;
}

function round(num) { 
    return Number(MATH_ROUND(num * 100) / 100);
}

function angleRadians(p1, p2) {
    return MATH_ATAN(p2.y - p1.y, p2.x - p1.x);
}

function angleDegrees(p1, p2) {
    return MATH_ATAN(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

function distance(x1, y1, x2, y2) {
    return MATH_SQRT( ( x2 -= x1 ) * x2 + ( y2 -= y1 ) * y2 );
}

function distance3D(x1, y1, z1, x2, y2, z2) {
    return MATH_SQRT( ( x2 -= x1 ) * x2 + ( y2 -= y1 ) * y2 + ( z2 -= z1 ) * z2 );
}

function isDecimal(num) {
    return num != floor(num);
}