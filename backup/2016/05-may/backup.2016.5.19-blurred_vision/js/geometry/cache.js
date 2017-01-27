var cache = new Array();

function getCache(id) {
    return (cache[id]);
}

function createCache(id, ctx, mbr) {
    var newcanvas = document.createElement('canvas');
    newcanvas.width = mbr.width;
    newcanvas.height = mbr.height;
    var newctx = newcanvas.getContext("2d");
    newctx.fillStyle = ctx.fillStyle;
    cache[id] = {
        canvas : newcanvas,
        ctx : newctx,
        mbr : mbr
    }
    return newctx;
}

function drawCache(id, ctx, mbr) {
    var c = cache[id];
    var canvas = c.canvas;
    
    var x = clamp(mbr.x);
    var y = clamp(mbr.y);
    var w = clamp(mbr.width);
    var h = clamp(mbr.height);
    
    ctx.drawImage(canvas, x, y, w, h);
//    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, mbr.x, mbr.y, mbr.width, mbr.height);
}