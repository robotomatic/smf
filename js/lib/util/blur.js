function blurCanvas(target, data, offset) {
    target.setAlpha(0.4);
    var dw = data.width - offset;
    var dh = data.height - offset;
    target.drawImage(data, offset, offset, dw, dh);
    target.drawImage(data, -offset, 0, dw, dh);
    target.setAlpha(1);
};