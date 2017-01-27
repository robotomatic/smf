var roundcorners = false;
var defaultradius = 2.5;

function clearRect(ctx, x, y, width, height) { ctx.clearRect(roundInt(x), roundInt(y), roundInt(width), roundInt(height)); }

function drawImage(image, ctx, x, y, width, height) { 
    ctx.fillRect(roundInt(x), roundInt(y), roundInt(width), roundInt(height)); 
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



function drawShape(ctx, shape, x, y, width, height, scale) {
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
    if (shape.ramp) drawTriangleOutline(ctx, color, shape, x, y, width, height, weight, opacity, scale);
    else if (shape.circle) drawCircleOutline(ctx, shape, x, y, width, height, weight, opacity, scale);
    else drawRectOutline(ctx, color, x, y, width, height, weight, opacity, scale);
}

function drawCircle(ctx, circle, x, y, width, height, scale) { 
    var centerX = x + (width / 2);
    var centerY = y + (height / 2);
    var radius = circle.circle ? circle.circle : circle;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();    
}

function drawCircleOutline(ctx, color, circle, x, y, width, height, weight, opacity, scale) {

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

    if (triangle.radius || roundcorners) {
        var radius = scale ? defaultradius * scale : defaultradius;
        drawRoundTriangle(ctx, triangle, x, y, width, height, radius);
        return;
    }
    
    ctx.beginPath();
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

    if (triangle.radius || roundcorners) {
        var radius = scale ? defaultradius * scale : defaultradius;
        weight = scale ? weight * scale : weight;
        drawRoundTriangleOutline(ctx, color, triangle, x, y, width, height, radius, weight, opacity);
        return;
    }
    
    ctx.beginPath();
    if (triangle.ramp == "left") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
    } else {
        ctx.moveTo(x, y + height);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
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
    var hrad = radius / 2;
    ctx.beginPath();
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
    var hrad = radius / 2;
    ctx.beginPath();
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
    
    if (roundcorners) {
        var radius = scale ? defaultradius * scale : defaultradius;
        drawRoundRect(ctx, x, y, width, height, radius);
        return;
    }
    
    ctx.fillRect(roundInt(x), roundInt(y), roundInt(width), roundInt(height)); 
}

function drawRectOutline(ctx, color, x, y, width, height, weight, opacity, scale) {
    if (roundcorners) {
        var radius = scale ? defaultradius * scale : defaultradius;
        weight = scale ? weight * scale : weight;
        drawRoundRectOutline(ctx, color, x, y, width, height, radius, weight, opacity);
        return;
    }
    
    ctx.lineCap = "round";            
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    weight = scale ? weight * scale : weight;
    
    ctx.lineWidth = weight ? weight : .2;
    
    ctx.strokeRect(x, y, width, height);            
    if (opacity) ctx.globalAlpha = 1;
}

function drawRoundRect(ctx, x, y, width, height, radius) {
    
    if (radius > width / 2) radius = width / 2;
    if (radius > height / 2) radius = height / 2;
    
    ctx.beginPath();
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

    if (radius > width / 2) radius = width / 2;
    if (radius > height / 2) radius = height / 2;
    
    ctx.beginPath();
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
    
    ctx.lineCap = "round";            
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
    if (opacity) ctx.globalAlpha = 1;
}

function drawLine(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
}

function drawRoundLine(ctx, points, flatbottom) {
    ctx.beginPath();
    
    var amount = 2;
    
    var spx = points[0].x;
    var spy = points[0].y;

    if (flatbottom) {
        amt = (spy - points[1].y) / 4;
        ctx.moveTo(spx, spy + amt);
    }
    
    var npx = points[1].x;
    var dx = Math.abs(spx - npx) / amount;
    if (npx > spx) npx -= dx;
    else npy += dx;
    
    var npy = points[1].y;
    var dy = Math.abs(spy - npy) / amount;
    if (npy > spy) npy -= dy;
    else npy += dy;
    
    if (flatbottom) ctx.lineTo(npx, npy);
    else ctx.moveTo(npx, npy);
    
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

        ctx.quadraticCurveTo(cpx, cpy, npx, npy);

        if (epx < cpx) npx = epx + dx;
        else npx = epx - dx;

        if (epy < cpy) npy = epy + dy;
        else npy = epy - dy;

        if (distance(cpx, cpy, npx, npy) > 0) {
            ctx.lineTo(npx, npy);
        }

        spx = cpx;
        spy = cpy;
    }


    
    if (flatbottom) {

        epx = points[points.length - 1].x;
        epy = points[points.length - 1].y;
        
        amt =  (epy - spy) / 4;
        
        ctx.lineTo(epx, epy - amt);
        
        ctx.quadraticCurveTo(epx, epy, epx - amt, epy);
        
        spx = points[0].x;
        spy = points[0].y;

        amt = (spy - points[1].y) / 4;

        ctx.lineTo(spx + amt, spy);
        
        
        ctx.quadraticCurveTo(spx, spy, spx, spy - amt);
    } else {
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

        ctx.lineTo(npx, npy);
        
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

        ctx.quadraticCurveTo(cpx, cpy, npx, npy);

        cpx = epx;
        cpy = epy;

        epx = points[1].x;
        epy = points[1].y;

        dx = Math.abs(cpx - epx) / amount;
        if (epx < cpx) npx = cpx - dx;
        else npx = cpx + dx;

        dy = Math.abs(cpy - epy) / amount;
        if (epy < cpy) npy = cpy - dy;
        else npy = cpy + dy;

        ctx.quadraticCurveTo(cpx, cpy, npx, npy);
    }

    
    ctx.closePath();
    ctx.fill();
}

function drawRoundLineOutline(ctx, points, color, weight) {
    drawRoundLine(ctx, points);
    ctx.lineCap = "round";            
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
}


function drawLineOutline(ctx, points, color, weight) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.lineCap = "round";            
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
}

