function blurCanvas(target, canvas, offset) {
    target.setAlpha(0.6);
    var data = canvas.getData();
    target.drawImage(data, offset, offset, data.width, data.height);
    target.drawImage(data, -offset, -offset, data.width, data.height);

    offset /= 2;
    if (offset > 0) {
        target.drawImage(data, offset, offset, data.width, data.height);
        target.drawImage(data, -offset, -offset, data.width, data.height);
    }

    target.setAlpha(1);
};
