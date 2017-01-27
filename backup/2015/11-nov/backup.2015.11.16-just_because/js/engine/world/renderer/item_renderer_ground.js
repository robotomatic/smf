ItemRendererGround = function() {}

ItemRendererGround.prototype.drawPlatform = function(ctx, item, x, y, width, height, scale, platform, drawdetails) {
    
    // todo: draw grass
    
    
    if (!scale) scale = 1;
    ctx.fillStyle = platform.color;
    var parts = item.parts;
    
    var poly = createPolygon(parts);
    drawPolygonLine(ctx, poly, x, y, scale);
    
    for (var i = 0; i < parts.length; i++) {
        var cp = parts[i];
        var cpx = x + (cp.x * scale);
        var cpy = y + (cp.y * scale);
        var cpw = cp.width * scale;
        var cph = cp.height * scale;
        
//        if (cp.ramp) {
//            drawTriangle(ctx, cp, cpx, cpy, cpw, cph, scale);
//            drawTriangleOutline(ctx, "red", cp, cpx, cpy, cpw, cph, scale, 1, 1);
//        } else {
//            drawRect(ctx, cpx, cpy, cpw, cph);
//            drawRectOutline(ctx, "red", cpx, cpy, cpw, cph, 1, 1);
//        }

    }
}


function createPolygon(items) {

    var points = new Array();

    if (items.length == 1) {
        var item = items[0];
        points[0] = new Point(item.x, item.y);
        points[1] = new Point(item.x + item.width, item.y);
        points[2] = new Point(item.x + item.width, item.y + item.height);
        points[3] = new Point(item.x, item.y + item.height);
        return points;
    }
    
    var turn = false;
    var t = items.length;
    for (var i = 0; i < t; i++) {
        
        var current = items[i];

        var prev;
        if (i > 0) prev = items[i - 1];
        else prev = items[0];
        
        var next;
        if (i < t - 1) next = items[i + 1];
        else next = items[0];
        
        var cx1 = current.x;
        var cy1 = current.y;
        var cx2 = current.x + current.width;
        var cy2 = current.y + current.height;

        var px1 = prev.x;
        var py1 = prev.y;
        var px2 = prev.x + prev.width;
        var py2 = prev.y + prev.height;
        
        var nx1 = next.x;
        var ny1 = next.y;
        var nx2 = next.x + next.width;
        var ny2 = next.y + next.height;
        
        if (nx2 >= cx2 && !turn) {
            
            var cx = cx1;
            if (px2 > cx1 && cy1 > py1) cx = px2;
            if (!current.ramp || current.ramp != "right") points[points.length] = new Point(cx, cy1);
            
            var cxx = cx2;
            if (i == 0 && nx1 < cx2) cxx = nx1;
            if (!current.ramp || current.ramp != "left") points[points.length] = new Point(cxx, cy1);
        } else  {
            if (!turn) {
                var cx = cx1;
                if (px2 > cx1) cx = px2;
                points[points.length] = new Point(cx, cy1);
                points[points.length] = new Point(cx2, cy1);
                turn = true;
            }
            if (!current.ramp || current.ramp != "right-top") if (cx1 != nx1) points[points.length] = new Point(cx2, cy2);
            if (!current.ramp || current.ramp != "left-top") points[points.length] = new Point(cx1, cy2);
        }
    }
    if (cx1 < nx2) nx2 = cx1;
    points[points.length] = new Point(nx2, ny2);
    points[points.length] = new Point(nx1, ny2);
    return points;
}

function drawPolygonLine(ctx, points, x, y, scale) {
    for (var i = 0; i < points.length; i++) {
        points[i].x = x + (points[i].x * scale);
        points[i].y = y + (points[i].y * scale);
    }
    drawLine(ctx,points);
//    drawLineOutline(ctx,points, "black", 2);
//    drawRoundLine(ctx, points);
//    drawRoundLineOutline(ctx, points, "black", 3);
}
