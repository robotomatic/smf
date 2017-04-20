"use strict";

function Item3DWaterline() {
    this.np = new Point(0, 0);
    this.pp = new Point(0, 0);
}

Item3DWaterline.prototype.projectItem3DWaterlineFront = function(item, window, wc) {

    var waterline = item.watersurface.front.points;
    if (!waterline.points.length) return;

    var front = item.geometry.front.geometry;
    
    var x = window.x;
    var y = window.y;
    var z = window.z;
    var scale = window.scale;
    
    var point;
    var px;
    var py;
    var pz;
    var ppy;
   
    for (var i = 1; i < waterline.points.length - 1; i++) {
        point = waterline.points[i];
        px = (point.x - x) * scale;
        py = (point.y - y) * scale;
        pz = (item.z - z) * scale;
        if (pz < -(__fov - 1)) {
            pz = -nz;
        }
        this.np.x = px;
        this.np.y = py;
        this.pp = projectPoint3D(this.np, pz, scale, x, y, wc, this.pp);
        if (front.points.length == 4) front.points.splice(3, 0, new Point(this.pp.x, this.pp.y));
        else {
            front.points[front.points.length - (i + 1)].x = this.pp.x;
            front.points[front.points.length - (i + 1)].y = this.pp.y;
        }
    }
    
    point = waterline.points[waterline.points.length - 1];
    px = (point.x - x) * scale;
    py = (point.y - y) * scale;
    pz = (item.z - z) * scale;
    if (pz < -(__fov - 1)) {
        pz = -nz;
    }
    this.np.x = px;
    this.np.y = py;
    this.pp = projectPoint3D(this.np, pz, scale, x, y, wc, this.pp);
    
    ppy = this.pp.y;
    if (this.pp.x > front.points[2].x) {
        var fp = front.points[2];
        var l = waterline.points.length - 1;
        var distx = waterline.points[l].x - waterline.points[l - 1].x;
        if (distx <= item.width) {
            distx *= scale;
            var disty = (waterline.points[l].y - waterline.points[l - 1].y) * scale;
            var diffx = this.pp.x - fp.x;
            var p = diffx / distx;       
            var dy = disty * p;         
            ppy = front.points[3].y + dy;
        }
    }
    front.points[2].y = ppy;


    point = waterline.points[0];
    px = (point.x - x) * scale;
    py = (point.y - y) * scale;
    pz = (item.z - z) * scale;
    if (pz < -(__fov - 1)) {
        var nz = __fov - 1;
        pz = -nz;
    }
    this.np.x = px;
    this.np.y = py;
    this.pp = projectPoint3D(this.np, pz, scale, x, y, wc, this.pp);

    ppy = this.pp.y;
    if (this.pp.x < front.points[front.points.length - 1].x) {
        var fp = front.points[front.points.length - 1];
        var distx = waterline.points[1].x - waterline.points[0].x;
        if (distx < item.width) {
            distx *= scale;
            var disty = (waterline.points[1].y - waterline.points[0].y) * scale;
            var diffx = fp.x - this.pp.x;
            var p = diffx / distx;       
            var dy = disty * p;         
            ppy = front.points[front.points.length - 2].y - dy;
        }
    }
    front.points[front.points.length - 1].y = ppy;
}
