function blurCanvas(target, data, offset) {
    target.setAlpha(0.5);
    var ow = offset > 2 ? offset * 2 : offset;
    target.drawImage(data, offset, 0, data.width - offset, data.height);
    target.drawImage(data, -offset, 0, data.width + ow, data.height);
    target.setAlpha(1);
};
