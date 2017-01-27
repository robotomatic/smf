// look at global shape cache:
// --> store shapes by height, width, info and number of points? 
// --> need some kind of string representation of shape not tied to x & y or scale...

var roundcorners = false;
var defaultradius = 2.5;

function clearRect(ctx, x, y, width, height) { 
    ctx.clearRect(roundInt(x), roundInt(y), roundInt(width), roundInt(height)); 
}

function drawImage(image, ctx, x, y, width, height) { 
    ctx.fillRect(roundInt(x), roundInt(y), roundInt(width), roundInt(height)); 
}

function blurCanvas(buffer, ctx, offset) {
    ctx.globalAlpha = 0.3;
    for (var i = 1; i <= 3; i++) {
        ctx.drawImage(buffer, offset, 0, buffer.width - offset, buffer.height, 0, 0,buffer.width - offset, buffer.height);
        ctx.drawImage(buffer, 0, offset, buffer.width, buffer.height - offset, 0, 0,buffer.width, buffer.height - offset);
        ctx.drawImage(buffer, -offset, 0, buffer.width + offset, buffer.height, 0, 0,buffer.width + offset, buffer.height);
        ctx.drawImage(buffer, 0, -offset, buffer.width, buffer.height + offset, 0, 0,buffer.width, buffer.height + offset);
    }
};

function shapeVisible(width, height, scale) {
    scale = scale ? scale : 1;
    return (width * scale > 1 && height * scale > 1);
}


function drawShape(ctx, shape, x, y, width, height, scale) {
    
    if (!shapeVisible(width, height, scale)) return;
    
    if (shape.ramp) drawTriangle(ctx, shape, x, y, width, height, scale);
    else if (shape.circle) drawCircle(ctx, shape, x, y, width, height, scale);
    else {
        if (shape.radius) {
            var radius = scale ? shape.radius * scale : shape.radius;
            drawRoundRect(ctx, x, y, width, height, radius);
        } else drawRect(ctx, x, y, width, height, scale);
    }
}

function drawShapeOutline(ctx, color, shape, x, y, width, height, weight, opacity, scale) {
    
    if (!shapeVisible(width, height, scale)) return;
    
    if (shape.ramp) drawTriangleOutline(ctx, color, shape, x, y, width, height, weight, opacity, scale);
    else if (shape.circle) drawCircleOutline(ctx, shape, x, y, width, height, weight, opacity, scale);
    else drawRectOutline(ctx, color, x, y, width, height, weight, opacity, scale);
}

function drawCircle(ctx, circle, x, y, width, height, scale) { 
    
    if (!shapeVisible(width, height, scale)) return;
    
    x = roundInt(x);
    y = roundInt(y);
    width = roundInt(width);
    height = roundInt(height);
    
    var centerX = x + (width / 2);
    var centerY = y + (height / 2);
    var radius = circle.circle ? circle.circle : circle;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();    
}

function drawCircleOutline(ctx, color, circle, x, y, width, height, weight, opacity, scale) {
    
    if (!shapeVisible(width, height, scale)) return;
    
    x = roundInt(x);
    y = roundInt(y);
    width = roundInt(width);
    height = roundInt(height);
    
    drawCircle(ctx, circle, x, y, width, height);
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    weight = scale ? weight * scale : weight;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
    if (opacity) ctx.globalAlpha = 1;
}

function drawTriangle(ctx, triangle, x, y, width, height, scale) { 
    
    if (!shapeVisible(width, height, scale)) return;
    
    x = roundInt(x);
    y = roundInt(y);
    width = roundInt(width);
    height = roundInt(height);
    
    if (triangle.radius || roundcorners) {
        var radius = scale ? defaultradius * scale : defaultradius;
        drawRoundTriangle(ctx, triangle, x, y, width, height, radius);
        return;
    }
    if (triangle.ramp == "left") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y);
    } else if (triangle.ramp == "left-top") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y);
    } else if (triangle.ramp == "right") {
        ctx.moveTo(x, y + height);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
    } else if (triangle.ramp == "right-top") {
        ctx.moveTo(x, y + height);
        ctx.lineTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x, y + height);
    }
    ctx.closePath();
    ctx.fill();    
}

function drawTriangleOutline(ctx, color, triangle, x, y, width, height, weight, opacity, scale) {
    
    if (!shapeVisible(width, height, scale)) return;
    
    x = roundInt(x);
    y = roundInt(y);
    width = roundInt(width);
    height = roundInt(height);
    
    if (triangle.radius || roundcorners) {
        var radius = scale ? defaultradius * scale : defaultradius;
        weight = scale ? weight * scale : weight;
        drawRoundTriangleOutline(ctx, color, triangle, x, y, width, height, radius, weight, opacity);
        return;
    }
    if (triangle.ramp == "left") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y);
    } else if (triangle.ramp == "left-top") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y);
    } else if (triangle.ramp == "right") {
        ctx.moveTo(x, y + height);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
    } else if (triangle.ramp == "right-top") {
        ctx.moveTo(x, y + height);
        ctx.lineTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x, y + height);
    }
    ctx.closePath();
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    weight = scale ? weight * scale : weight;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
    if (opacity) ctx.globalAlpha = 1;
}


function drawRoundTriangle(ctx, triangle, x, y, width, height, radius) {
    
    if (!shapeVisible(width, height)) return;
    
    x = roundInt(x);
    y = roundInt(y);
    width = roundInt(width);
    height = roundInt(height);
    
    var hrad = radius / 2;
    if (triangle.ramp == "left") {
        ctx.moveTo(x + hrad, y);
        ctx.lineTo(x + width - hrad, y + height - hrad);
        ctx.quadraticCurveTo(x + width, y + height, x + width - hrad, y + height);
        ctx.lineTo(x + hrad, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - hrad);
        ctx.lineTo(x, y + hrad);
        ctx.quadraticCurveTo(x, y, x + hrad, y);
    } else {
        ctx.moveTo(x + hrad, y + height - hrad);
        ctx.lineTo(x + width - hrad, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + hrad);
        ctx.lineTo(x + width, y + height - hrad);
        ctx.quadraticCurveTo(x + width, y + height, x + width - hrad, y + height);
        ctx.lineTo(x + hrad, y + height);
        ctx.quadraticCurveTo(x, y + height, x + hrad, y + height - hrad);
    }
    ctx.closePath();
    ctx.fill();    
}


function drawRoundTriangleOutline(ctx, color, triangle, x, y, width, height, radius, weight, opacity) {
    
    if (!shapeVisible(width, height)) return;
    
    x = roundInt(x);
    y = roundInt(y);
    width = roundInt(width);
    height = roundInt(height);
    
    var hrad = radius / 2;
    if (triangle.ramp == "left") {
        ctx.moveTo(x + hrad, y);
        ctx.lineTo(x + width - hrad, y + height - hrad);
        ctx.quadraticCurveTo(x + width, y + height, x + width - hrad, y + height);
        ctx.lineTo(x + hrad, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - hrad);
        ctx.lineTo(x, y + hrad);
        ctx.quadraticCurveTo(x, y, x + hrad, y);
    } else {
        ctx.moveTo(x + hrad, y + height - hrad);
        ctx.lineTo(x + width - hrad, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + hrad);
        ctx.lineTo(x + width, y + height - hrad);
        ctx.quadraticCurveTo(x + width, y + height, x + width - hrad, y + height);
        ctx.lineTo(x + hrad, y + height);
        ctx.quadraticCurveTo(x, y + height, x + hrad, y + height - hrad);
    }
    ctx.closePath();
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
    if (opacity) ctx.globalAlpha = 1;
}

function drawRect(ctx, x, y, width, height, scale) { 
    
    if (!shapeVisible(width, height, scale)) return;
    
    if (roundcorners) {
        var radius = scale ? defaultradius * scale : defaultradius;
        drawRoundRect(ctx, x, y, width, height, radius);
        return;
    }
    ctx.fillRect(roundInt(x), roundInt(y), roundInt(width), roundInt(height)); 
}

function drawRectOutline(ctx, color, x, y, width, height, weight, opacity, scale) {
    
    if (!shapeVisible(width, height, scale)) return;
    
    if (roundcorners) {
        var radius = scale ? defaultradius * scale : defaultradius;
        weight = scale ? weight * scale : weight;
        drawRoundRectOutline(ctx, color, x, y, width, height, radius, weight, opacity);
        return;
    }
    
    
    x = roundInt(x);
    y = roundInt(y);
    width = roundInt(width);
    height = roundInt(height);
    
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    weight = scale ? weight * scale : weight;
    ctx.lineWidth = weight ? weight : .2;
    ctx.strokeRect(x, y, width, height);            
    if (opacity) ctx.globalAlpha = 1;
}

function drawRoundRect(ctx, x, y, width, height, radius) {
    
    if (!shapeVisible(width, height)) return;
    
    x = roundInt(x);
    y = roundInt(y);
    width = roundInt(width);
    height = roundInt(height);
    
    if (radius > width / 2) radius = width / 2;
    if (radius > height / 2) radius = height / 2;
    
    radius = roundInt(radius);
    
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

function drawRoundRectOutline(ctx, color, x, y, width, height, radius, weight, opacity) {
    
    if (!shapeVisible(width, height)) return;
    
    x = roundInt(x);
    y = roundInt(y);
    width = roundInt(width);
    height = roundInt(height);
    
    if (radius > width / 2) radius = width / 2;
    if (radius > height / 2) radius = height / 2;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
//    ctx.fill();
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
    if (opacity) ctx.globalAlpha = 1;
}

function createLine(ctx, line) {

    var startx = roundInt(line.start.x);
    var starty = roundInt(line.start.y); 
    var endx = roundInt(line.end.x);
    var endy = roundInt(line.end.y);
    
    ctx.moveTo(startx, starty);
    ctx.lineTo(endx, endy);
}


function drawLine(ctx, line, color, weight) {
    createLine(ctx, line);
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
}

function drawPolyline(ctx, polyline, color, weight) {
    var points = polyline.points;
    if (points.length < 1) return;
    ctx.moveTo(roundInt(points[0].x), roundInt(points[0].y));
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(roundInt(points[i].x), roundInt(points[i].y));
    }
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
}







function drawDebug(ctx, item, x, y, scale) {
    var color = "magenta";
    var parts = item.parts;
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        drawShapeOutline(ctx, color, part, x + part.x, y + part.y, part.width, part.height, 2, 1, scale);
    }
}







function makePolygon(ctx, points) {
    
    var dx = 0;
    var dy = 0;
    if (points[0].info && points[0].info == "round") {
        dx = (points[1].x - points[0].x) / 2;
        dy = (points[1].y - points[0].y) / 2;
        ctx.moveTo(roundInt(points[0].x + dx), roundInt(points[0].y + dy));
    } else if (points[0].info && points[0].info == "smooth") {
        ctx.moveTo(roundInt(points[1].x), roundInt(points[1].y));
    } else if (!points[0].info || points[0].info != "skip") {
        ctx.moveTo(roundInt(points[0].x), roundInt(points[0].y));
    }
    
    var npx = 0;
    var npy = 0;
    for (var i = 1; i < points.length; i++) {
        var p = points[i];
        if (p.info) {
            if (p.info == "skip") continue;
            
            if (p.info == "round") {
                
                dx = (points[i].x - points[i - 1].x) / 2;
                dy = (points[i].y - points[i - 1].y) / 2;
                
                ctx.lineTo(points[i].x - dx, points[i].y - dy);
                
                if (i < points.length - 1) {
                    dx = (points[i + 1].x - points[i].x) / 2;
                    dy = (points[i + 1].y - points[i].y) / 2;
                } else {
                    dx = (points[0].x - points[i].x) / 2;
                    dy = (points[0].y - points[i].y) / 2;
                }

                ctx.quadraticCurveTo(p.x, p.y, p.x + dx, p.y + dy);    
            } else if (p.info == "smooth") {
                if (i < points.length - 1) {
                    npx = points[i + 1].x;
                    npy = points[i + 1].y;
                    i++;
                } else {
                    npx = points[0].x;
                    npy = points[0].y;
                }
                ctx.quadraticCurveTo(p.x, p.y, npx, npy);    
            } else {
                ctx.lineTo(roundInt(p.x), roundInt(p.y));
            }
        } else {
            ctx.lineTo(roundInt(p.x), roundInt(p.y));
        }
    }
    
    if (points[0].info && points[0].info == "round") {
        
        dx = (points[0].x - points[i - 1].x) / 2;
        dy = (points[0].y - points[i - 1].y) / 2;

        ctx.lineTo(points[i - 1].x + dx, points[i - 1].y + dy);
        
        dx = (points[1].x - points[0].x) / 2;
        dy = (points[1].y - points[0].y) / 2;
        ctx.quadraticCurveTo(points[0].x, points[0].y, points[0].x + dx, points[0].y + dy);    
    } else if (points[0].info && points[0].info == "smooth") {
        ctx.quadraticCurveTo(points[0].x, points[0].y, points[1].x, points[1].y);    
    } else if (!points[0].info || points[0].info != "skip") {
        ctx.closePath();
    }
}

function drawPolygon(ctx, points) {
    makePolygon(ctx, points);
    ctx.fill();
}

function drawPolygonOutline(ctx, points, color, weight) {
    if (points.length < 2) return;
    makePolygon(ctx, points);
    ctx.lineCap = "round";            
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
}


function makeRoundPolygon(ctx, points, amount) {
    if (points.length < 2) return;
    if (!amount) amount = 2;

    var spx = points[0].x;
    var spy = points[0].y;
    
    var npx = points[1].x;
    var npy = points[1].y;
    
    var dx = Math.abs(spx - npx) / amount;
    if (npx > spx) dx = -dx;

    var dy = Math.abs(spy - npy) / amount;
    if (npy > spy) dy = -dy;
    
    var startpoint = new Point(spx - dx, spy - dy);
    ctx.moveTo(roundInt(startpoint.x), roundInt(startpoint.y));

    npx += dx;
    npy += dy;
    ctx.lineTo(roundInt(npx), roundInt(npy));
    
    var sspx = npx;
    var sspy = npy;
    for (var i = 1; i < points.length - 1; i++) {
        var cpx = points[i].x;
        var cpy = points[i].y;
        var epx;
        var epy;
        if (i < points.length - 1) {
            epx = points[i + 1].x;
            epy = points[i + 1].y;
        } else {
            epx = points[0].x;
            epy = points[0].y;
        }
        dx = Math.abs(cpx - epx) / amount;
        if (epx < cpx) npx = cpx - dx;
        else npx = cpx + dx;
        dy = Math.abs(cpy - epy) / amount;
        if (epy < cpy) npy = cpy - dy;
        else npy = cpy + dy;
        ctx.quadraticCurveTo(roundInt(cpx), roundInt(cpy), roundInt(npx), roundInt(npy));
        if (epx < cpx) npx = epx + dx;
        else npx = epx - dx;
        if (epy < cpy) npy = epy + dy;
        else npy = epy - dy;
        if (distance(cpx, cpy, npx, npy) > 0) {
            ctx.lineTo(roundInt(npx), roundInt(npy));
        }
        spx = cpx;
        spy = cpy;
    }

    cpx = points[points.length - 2].x;
    cpy = points[points.length - 2].y;
    epx = points[points.length - 1].x;
    epy = points[points.length - 1].y;
    dx = Math.abs(cpx - epx) / amount;
    if (cpx < epx) npx = epx - dx;
    else npx = epx + dx;
    dy = Math.abs(cpy - epy) / amount;
    if (cpy < epy) npy = epy - dy;
    else npy = epy + dy;
    
    ctx.lineTo(roundInt(npx), roundInt(npy));
    
    cpx = epx;
    cpy = epy;
    epx = points[0].x;
    epy = points[0].y;
    dx = Math.abs(cpx - epx) / amount;
    if (epx < cpx) npx = cpx - dx;
    else npx = cpx + dx;
    dy = Math.abs(cpy - epy) / amount;
    if (epy < cpy) npy = cpy - dy;
    else npy = cpy + dy;
    ctx.quadraticCurveTo(roundInt(cpx), roundInt(cpy), roundInt(npx), roundInt(npy));
    
    cpx = npx;
    cpy = npy;
    
    epx = points[0].x;
    epy = points[0].y;
    
    dx = Math.abs(cpx - epx) / amount;
    if (epx < cpx) npx = epx + dx;
    else npx = epx - dx;
    
    dy = Math.abs(cpy - epy) / amount;
    if (epy < cpy) npy = epy + dy;
    else npy = epy - dy;

    ctx.lineTo(npx, npy);

    ctx.quadraticCurveTo(roundInt(epx), roundInt(epy), roundInt(startpoint.x), roundInt(startpoint.y));
}

function drawRoundPolygon(ctx, points, amount) {
    makeRoundPolygon(ctx, points, amount);
    ctx.fill();
}





function drawRoundPolygonFlatBottom(ctx, points, amount) {
    if (points.length < 2) return;
    if (!amount) amount = 2;
    var spx = points[0].x;
    var spy = points[0].y;
    amt = (spy - points[1].y) / 4;
    ctx.moveTo(roundInt(spx), roundInt(spy + amt));
    var npx = points[1].x;
    var dx = Math.abs(spx - npx) / amount;
    if (npx > spx) npx -= dx;
    else npy += dx;
    var npy = points[1].y;
    var dy = Math.abs(spy - npy) / amount;
    if (npy > spy) npy -= dy;
    else npy += dy;
    ctx.lineTo(roundInt(npx), roundInt(npy));
    var sspx = npx;
    var sspy = npy;
    for (var i = 1; i < points.length - 1; i++) {
        var cpx = points[i].x;
        var cpy = points[i].y;
        var epx;
        var epy;
        if (i < points.length - 1) {
            epx = points[i + 1].x;
            epy = points[i + 1].y;
        } else {
            epx = points[0].x;
            epy = points[0].y;
        }
        dx = Math.abs(cpx - epx) / amount;
        if (epx < cpx) npx = cpx - dx;
        else npx = cpx + dx;
        dy = Math.abs(cpy - epy) / amount;
        if (epy < cpy) npy = cpy - dy;
        else npy = cpy + dy;
        ctx.quadraticCurveTo(roundInt(cpx), roundInt(cpy), roundInt(npx), roundInt(npy));
        if (epx < cpx) npx = epx + dx;
        else npx = epx - dx;
        if (epy < cpy) npy = epy + dy;
        else npy = epy - dy;
        if (distance(cpx, cpy, npx, npy) > 0) {
            ctx.lineTo(roundInt(npx), roundInt(npy));
        }
        spx = cpx;
        spy = cpy;
    }
    epx = points[points.length - 1].x;
    epy = points[points.length - 1].y;
    amt =  (epy - spy) / 4;
    ctx.lineTo(roundInt(epx), roundInt(epy - amt));
    ctx.quadraticCurveTo(roundInt(epx), roundInt(epy), roundInt(epx - amt), roundInt(epy));
    spx = points[0].x;
    spy = points[0].y;
    amt = (spy - points[1].y) / 4;
    ctx.lineTo(roundInt(spx + amt), roundInt(spy));
    ctx.quadraticCurveTo(roundInt(spx), roundInt(spy), roundInt(spx), roundInt(spy - amt));
    ctx.closePath();
    ctx.fill();
}

function drawRoundPolygonOutline(ctx, points, amount, color, weight, flatbottom) {
    if (points.length < 2) return;
    makeRoundPolygon(ctx, points, amount);
    ctx.lineCap = "round";            
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
}


function drawText(ctx, text, color, x, y) {
    ctx.fillStyle = color;
    ctx.font = "bold 8px Arial";
    ctx.fillText(text, x, y);    
}

function drawSmoothPolygon(ctx, points) {
    
    // todo: here is a big bottleneck. find a way to cache and index polys!!!
    //       better yet --> implement generic solution for all shapes!!!!
    //       need to unify all draw calls

    var sxc = points[points.length - 1].x + ((points[0].x - points[points.length - 1].x) / 2);
    var syc = points[points.length - 1].y + ((points[0].y - points[points.length - 1].y) / 2);
    
    ctx.moveTo(sxc, syc);
    
    for (i = 0; i < points.length - 1; i ++) {
        
        if (points[i].info) {
            ctx.lineTo(points[i].x, points[i].y);
        } else {
            if (points[i + 1] && points[i + 1].info) {
                ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
            } else {
                xc = (points[i].x + points[i + 1].x) / 2;
                yc = (points[i].y + points[i + 1].y) / 2;
                ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
        }
    }

    xc = points[points.length - 1].x;
    yc = points[points.length - 1].y;
    
    ctx.quadraticCurveTo(xc, yc, sxc, syc);    
    
    ctx.fill();
}

function drawSmoothPolygonOutline(ctx, points, color, weight) {

    var sxc = points[points.length - 1].x + ((points[0].x - points[points.length - 1].x) / 2);
    var syc = points[points.length - 1].y + ((points[0].y - points[points.length - 1].y) / 2);
    
    ctx.moveTo(sxc, syc);
    
    for (i = 0; i < points.length - 1; i ++) {
        
        if (points[i].info) {
            ctx.lineTo(points[i].x, points[i].y);
        } else {
            xc = (points[i].x + points[i + 1].x) / 2;
            yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
    }

    xc = points[points.length - 1].x;
    yc = points[points.length - 1].y;
    
    ctx.quadraticCurveTo(xc, yc, sxc, syc);    
    
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
}