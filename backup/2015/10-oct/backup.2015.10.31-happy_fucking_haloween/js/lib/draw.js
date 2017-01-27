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
    else if (shape.radius) drawCircle(ctx, shape, x, y, width, height, scale);
    else drawRect(ctx, x, y, width, height, scale);
}

function drawShapeOutline(ctx, color, shape, x, y, width, height, weight, opacity, scale) {
    if (shape.ramp) drawTriangleOutline(ctx, color, shape, x, y, width, height, weight, opacity, scale);
    else if (shape.circle) drawCircleOutline(ctx, shape, x, y, width, height, weight, opacity, scale);
    else drawRectOutline(ctx, color, x, y, width, height, weight, opacity, scale);
}

function drawCircle(ctx, circle, x, y, width, height, scale) { 
    var centerX = x + (width / 2);
    var centerY = y + (height / 2);
    var radius = circle.radius;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();    
}

function drawCircleOutline(ctx, color, circle, x, y, width, height, weight, opacity, scale) {
    var centerX = x + (width / 2);
    var centerY = y + (height / 2);
    var radius = circle.radius;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    
    weight = scale ? weight * scale : weight;
    
    ctx.lineWidth = weight ? weight : .2;
    ctx.fill();            
    ctx.stroke();            
    if (opacity) ctx.globalAlpha = 1;
}

function drawTriangle(ctx, triangle, x, y, width, height, scale) { 

    if (roundcorners) {
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
    } else {
        ctx.moveTo(x, y + height);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
    }
    ctx.closePath();
    ctx.fill();    
}

function drawTriangleOutline(ctx, color, triangle, x, y, width, height, weight, opacity, scale) {

    if (roundcorners) {
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
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    weight = scale ? weight * scale : weight;
    ctx.lineWidth = weight ? weight : .2;
    ctx.strokeRect(x, y, width, height);            
    if (opacity) ctx.globalAlpha = 1;
}

function drawRoundRect(ctx, x, y, width, height, radius) {
    
    if (radius > width) radius = width;
    if (radius > height) radius = height;
    
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
    if (radius > width) radius = width;
    if (radius > height) radius = height;
    
    
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
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
    if (opacity) ctx.globalAlpha = 1;
}
