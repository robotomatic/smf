function clearRect(ctx, x, y, width, height) { ctx.clearRect(roundInt(x), roundInt(y), roundInt(width), roundInt(height)); }

function drawRect(ctx, x, y, width, height) { ctx.fillRect(roundInt(x), roundInt(y), roundInt(width), roundInt(height)); }

function drawImage(image, ctx, x, y, width, height) { 
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

function blurCanvas(buffer, ctx, offset) {
    ctx.globalAlpha = 0.3;
    for (var i = 1; i <= 3; i++) {
        ctx.drawImage(buffer, offset, 0, buffer.width-offset, buffer.height, 0, 0,buffer.width-offset, buffer.height);
        ctx.drawImage(buffer, 0, offset, buffer.width, buffer.height-offset, 0, 0,buffer.width, buffer.height-offset);
        ctx.drawImage(buffer, -offset, 0, buffer.width+offset, buffer.height, 0, 0,buffer.width+offset, buffer.height);
        ctx.drawImage(buffer, 0, -offset, buffer.width, buffer.height+offset, 0, 0,buffer.width, buffer.height+offset);
    }
};
