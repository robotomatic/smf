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
    var nz = __fov - 1;
    var add = front.points.length == 4;
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
        if (add) front.points.splice(3, 0, new Point(this.pp.x, this.pp.y));
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



Item3DWaterline.prototype.projectItem3DWaterlineLeft = function(item, window, wc) {
    if (!item.geometry.visible.left.visible) return;
    if (!item.geometry.left.showing) return;
    var waterline = item.watersurface.left.points;
    if (!waterline.points.length) return;
    var geom = item.geometry.left.geometry;

    var x = window.x;
    var y = window.y;
    var z = window.z;
    var scale = window.scale;
    var point;
    var px;
    var py;
    var pz;
    var ppy;
    var nz = __fov - 1;
    
     var add = geom.points.length == 4;
    var sz = waterline.points[1].z - waterline.points[0].z;
    if (sz < item.depth) {
         for (var i = 1; i < waterline.points.length - 1; i++) {
             point = waterline.points[i];
             px = (item.x - x) * scale;
             py = (point.y - y) * scale;
             pz = (point.z - z) * scale;
             if (pz < -(__fov - 1)) {
                 pz = -nz;
             }
             this.np.x = px;    
             this.np.y = py;
             this.pp = projectPoint3D(this.np, pz, scale, x, y, wc, this.pp);
             if (add) geom.points.push(new Point(this.pp.x, this.pp.y));
             else {
                 geom.points[geom.points.length - (i + 1)].x = this.pp.x;
                 geom.points[geom.points.length - (i + 1)].y = this.pp.y;
             }
         }
    }

    
   point = waterline.points[0];
   ppy = point.y;
   if (point.z < item.z) {
      var fp = geom.points[3];
      var distz = waterline.points[0].z - waterline.points[1].z;
      if (distz <= item.depth) {
          var disty = waterline.points[0].y - waterline.points[1].y;
          var diffz = point.z - item.z;
          var p = diffz / distz;       
          var dy = disty * p;         
          ppy -= dy;
      }
   }

   px = (item.x - x) * scale;
   py = (ppy - y) * scale;
   pz = (item.z - z) * scale;
   if (pz < -(__fov - 1)) {
      pz = -nz;
   }
   this.np.x = px;
   this.np.y = py;
   this.pp = projectPoint3D(this.np, pz, scale, x, y, wc, this.pp);
   if (!item.geometry.visible.front.visible) geom.points[3].y = this.pp.y;

    point = waterline.points[waterline.points.length - 1];
    if (sz == item.depth) {
        point = waterline.points[1];
    }
    
    ppy = point.y;
    if (point.z > item.z + item.depth) {
       var fp = geom.points[0];
       var distz = waterline.points[waterline.points.length - 1].z - waterline.points[waterline.points.length - 2].z;
       if (distz < item.depth) {
           var disty = waterline.points[waterline.points.length - 1].y - waterline.points[waterline.points.length - 2].y;
           var diffz = point.z - (item.z + item.depth);
           var p = diffz / distz;       
           var dy = disty * p;         
           ppy -= dy;
       }
    }
    px = (item.x - x) * scale;
    py = (ppy - y) * scale;
    pz = ((item.z + item.depth) - z) * scale;
    if (pz < -(__fov - 1)) {
     var nz = __fov - 1;
     pz = -nz;
    }
    this.np.x = px;
    this.np.y = py;
    this.pp = projectPoint3D(this.np, pz, scale, x, y, wc, this.pp);
    geom.points[0].y = this.pp.y;
}


Item3DWaterline.prototype.projectItem3DWaterlineRight = function(item, window, wc) {
    if (!item.geometry.visible.right.visible) return;
    if (!item.geometry.right.showing) return;
    var waterline = item.watersurface.right.points;
    if (!waterline.points.length) return;
    var geom = item.geometry.right.geometry;
    
    var x = window.x;
    var y = window.y;
    var z = window.z;
    var scale = window.scale;
    var point;
    var px;
    var py;
    var pz;
    var ppy;
    var nz = __fov - 1;
    
    var add = geom.points.length == 4;

    var sz = waterline.points[1].z - waterline.points[0].z;
    if (sz < item.depth) {
        for (var i = 1; i < waterline.points.length - 1; i++) {
            point = waterline.points[i];
            px = ((item.x + item.width) - x) * scale;
            py = (point.y - y) * scale;
            pz = (point.z - z) * scale;
            if (pz < -(__fov - 1)) {
                pz = -nz;
            }
            this.np.x = px;
            this.np.y = py;
            this.pp = projectPoint3D(this.np, pz, scale, x, y, wc, this.pp);
            if (add) geom.points.splice(2, 0, new Point(this.pp.x, this.pp.y));
           else {
               geom.points[geom.points.length - 2 - (i + 1)].x = this.pp.x;
               geom.points[geom.points.length - 2 - (i + 1)].y = this.pp.y;
           }
        }
    }

    point = waterline.points[0];
    ppy = point.y;
    if (point.z < item.z) {
        var fp = geom.points[3];
        var distz = waterline.points[0].z - waterline.points[1].z;
        if (distz <= item.depth) {
            var disty = waterline.points[0].y - waterline.points[1].y;
            var diffz = point.z - item.z;
            var p = diffz / distz;       
            var dy = disty * p;         
            ppy -= dy;
        }
    }

    px = (item.x - x) * scale;
    py = (ppy - y) * scale;
    pz = (item.z - z) * scale;
    if (pz < -(__fov - 1)) {
        pz = -nz;
    }
    this.np.x = px;
    this.np.y = py;
    this.pp = projectPoint3D(this.np, pz, scale, x, y, wc, this.pp);
    if (!item.geometry.visible.front.visible) geom.points[geom.points.length - 2].y = this.pp.y;

    point = waterline.points[waterline.points.length - 1];
    if (sz == item.depth) {
        point = waterline.points[1];
    }
    
    ppy = point.y;
    if (point.z > item.z + item.depth) {
        var fp = geom.points[0];
        var distz = waterline.points[waterline.points.length - 1].z - waterline.points[waterline.points.length - 2].z;
        if (distz < item.depth) {
            var disty = waterline.points[waterline.points.length - 1].y - waterline.points[waterline.points.length - 2].y;
            var diffz = point.z - (item.z + item.depth);
            var p = diffz / distz;       
            var dy = disty * p;         
            ppy -= dy;
        }
    }
    px = (item.x - x) * scale;
    py = (ppy - y) * scale;
    pz = ((item.z + item.depth) - z) * scale;
    if (pz < -(__fov - 1)) {
        var nz = __fov - 1;
        pz = -nz;
    }
    this.np.x = px;
    this.np.y = py;
    this.pp = projectPoint3D(this.np, pz, scale, x, y, wc, this.pp);
    geom.points[1].y = this.pp.y;
}
