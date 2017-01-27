function blurCanvas(buffer, ctx, offset = 2, iterations = 1) {

    if (offset <= 0 || iterations <= 0) return;

    // todo: compensate for added width & height
    
//    ctx.save();
//    ctx.translate(offset, offset);
//    var s = offset / buffer.width;
//    ctx.scale(s, s);

    ctx.globalAlpha = 0.5;
    for (var i = 1; i <= iterations; i++) {
        ctx.drawImage(buffer, offset, 0, buffer.width - offset, buffer.height, 0, 0,buffer.width - offset, buffer.height);
        ctx.drawImage(buffer, 0, offset, buffer.width, buffer.height - offset, 0, 0,buffer.width, buffer.height - offset);
        ctx.drawImage(buffer, -offset, 0, buffer.width + offset, buffer.height, 0, 0,buffer.width + offset, buffer.height);
        ctx.drawImage(buffer, 0, -offset, buffer.width, buffer.height + offset, 0, 0,buffer.width, buffer.height + offset);
    }
    ctx.globalAlpha = 1;
    
//    ctx.restore();
};