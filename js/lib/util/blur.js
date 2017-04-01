function blurCanvas(buffer, gamecanvas, offset = 2, iterations = 1) {
    if (offset <= 0 || iterations <= 0) return;
    gamecanvas.setAlpha(0.5);
    for (var i = 1; i <= iterations; i++) {
//        gamecanvas.drawImage(buffer, offset, offset, buffer.width - offset, buffer.height, 0, 0,buffer.width - offset, buffer.height);
         gamecanvas.drawImage(buffer, offset, 0, buffer.width - offset, buffer.height, 0, 0,buffer.width - offset, buffer.height);
         gamecanvas.drawImage(buffer, 0, offset, buffer.width, buffer.height - offset, 0, 0,buffer.width, buffer.height - offset);
         gamecanvas.drawImage(buffer, -offset, 0, buffer.width + offset, buffer.height, 0, 0,buffer.width + offset, buffer.height);
         gamecanvas.drawImage(buffer, 0, -offset, buffer.width, buffer.height + offset, 0, 0,buffer.width, buffer.height + offset);
    }
    gamecanvas.setAlpha(1);
};
