function blurCanvas(buffer, ctx, offset = 2, iterations = 1) {
    if (offset <= 0 || iterations <= 0) return;
    ctx.globalAlpha = 0.5;
    for (var i = 1; i <= iterations; i++) {
        ctx.drawImage(buffer, offset, offset, buffer.width - offset, buffer.height, 0, 0,buffer.width - offset, buffer.height);
//         ctx.drawImage(buffer, offset, 0, buffer.width - offset, buffer.height, 0, 0,buffer.width - offset, buffer.height);
//         ctx.drawImage(buffer, 0, offset, buffer.width, buffer.height - offset, 0, 0,buffer.width, buffer.height - offset);
//         ctx.drawImage(buffer, -offset, 0, buffer.width + offset, buffer.height, 0, 0,buffer.width + offset, buffer.height);
//         ctx.drawImage(buffer, 0, -offset, buffer.width, buffer.height + offset, 0, 0,buffer.width, buffer.height + offset);
    }
    ctx.globalAlpha = 1;
};
