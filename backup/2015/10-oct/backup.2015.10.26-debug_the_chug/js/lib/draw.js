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



function drawShape(ctx, shape, x, y, width, height) {
    if (shape.ramp) drawTriangle(ctx, shape, x, y, width, height);
    else if (shape.radius) drawCircle(ctx, shape, x, y, width, height);
    else drawRect(ctx, x, y, width, height);
}

function drawShapeOutline(ctx, color, shape, x, y, width, height, weight, opacity) {
    if (shape.ramp) drawTriangleOutline(ctx, color, shape, x, y, width, height, weight, opacity);
    else if (shape.circle) drawCircleOutline(ctx, shape, x, y, width, height, weight, opacity);
    else drawRectOutline(ctx, color, x, y, width, height, weight, opacity);
}

function drawCircle(ctx, circle, x, y, width, height) { 
    
    var centerX = x + (width / 2);
    var centerY = y + (height / 2);
    var radius = circle.radius;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();    
}

function drawCircleOutline(ctx, color, circle, x, y, width, height, weight, opacity) {

    var centerX = x + (width / 2);
    var centerY = y + (height / 2);
    var radius = circle.radius;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    ctx.lineWidth = weight ? weight : .2;
    ctx.fill();            
    ctx.stroke();            
    if (opacity) ctx.globalAlpha = 1;
}

function drawTriangle(ctx, triangle, x, y, width, height) { 
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
    ctx.fill();    
}

function drawTriangleOutline(ctx, color, triangle, x, y, width, height, weight, opacity) {
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
    ctx.lineWidth = weight ? weight : .2;
    ctx.stroke();            
    if (opacity) ctx.globalAlpha = 1;
}


function drawRect(ctx, x, y, width, height) { 
    ctx.fillRect(roundInt(x), roundInt(y), roundInt(width), roundInt(height)); 
}

function drawRectOutline(ctx, color, x, y, width, height, weight, opacity) {
    ctx.lineCap = "round";            
    ctx.strokeStyle = color;
    if (opacity) ctx.globalAlpha = opacity;
    ctx.lineWidth = weight ? weight : .2;
    ctx.strokeRect(x, y, width, height);            
    if (opacity) ctx.globalAlpha = 1;
}
