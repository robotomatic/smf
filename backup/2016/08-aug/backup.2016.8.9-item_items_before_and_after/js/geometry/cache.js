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
    ctx.drawImage(c.canvas, x, y, w, h);
}