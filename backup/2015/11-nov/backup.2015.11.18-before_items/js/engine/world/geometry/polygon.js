Polygon = function() {
    this.points = new Array();
    this.tops = new Array();
    this.bottoms = new Array();
    this.sides = new Array();
}

Polygon.prototype.addPoint = function(point) {
    this.points[this.points.length] = point;
}

Polygon.prototype.createPolygon = function(items) {

    this.points = new Array();
    this.tops = new Array();
    this.bottoms = new Array();
    this.sides = new Array();

    if (items.length == 1) {
        var item = items[0];
        this.points[0] = new Point(item.x, item.y);
        this.points[1] = new Point(item.x + item.width, item.y);
        this.tops[0] = new Line(this.points[0], this.points[1]);
        
        this.sides[0] = new Line(this.points[1], this.points[2]);

        this.points[2] = new Point(item.x + item.width, item.y + item.height);
        this.points[3] = new Point(item.x, item.y + item.height);
        this.bottoms[0] = new Line(this.points[2], this.points[3]);
        
        this.sides[1] = new Line(this.points[3], this.points[0]);
        
        return this.points;
    }
    
    var turn = false;
    var t = items.length;
    for (var i = 0; i < t; i++) {
        
        var current = items[i];

        var prev;
        if (i > 0) prev = items[i - 1];
        else prev = items[0];
        
        var next;
        if (i < t - 1) next = items[i + 1];
        else next = items[0];
        
        var cx1 = current.x;
        var cy1 = current.y;
        var cx2 = current.x + current.width;
        var cy2 = current.y + current.height;

        var px1 = prev.x;
        var py1 = prev.y;
        var px2 = prev.x + prev.width;
        var py2 = prev.y + prev.height;
        
        var nx1 = next.x;
        var ny1 = next.y;
        var nx2 = next.x + next.width;
        var ny2 = next.y + next.height;
        
        if (nx2 >= cx2 && !turn) {
            
            var cx = cx1;
            if (px2 > cx1 && cy1 > py1) cx = px2;
            var sp = new Point(cx, cy1);
            
            var cxx = cx2;
            if (i == 0 && nx1 < cx2) cxx = nx1;
            var ep = new Point(cxx, cy1);
            
            if (current.ramp) {
                if (current.ramp == "left") {
                    this.points[this.points.length] = sp;
                    this.tops[this.tops.length] = new Line(this.points[this.points.length - 2], new Point(cx2, cy2));                    
                } else if (current.ramp == "right") {
                    this.points[this.points.length] = ep;
                    this.tops[this.tops.length] = new Line(this.points[this.points.length - 2], ep);                    
                }
            } else {
                this.points[this.points.length] = sp;                
                this.points[this.points.length] = ep;
                if (this.points.length > 1) this.tops[this.tops.length] = new Line(sp, ep);
            }
        } else  {
            if (!turn) {
                var cx = cx1;
                if (px2 > cx1) cx = px2;
                this.points[this.points.length] = new Point(cx, cy1);
                this.points[this.points.length] = new Point(cx2, cy1);
                this.tops[this.tops.length] = new Line(this.points[this.points.length - 2], this.points[this.points.length - 1]);    
                turn = true;
            }
            if (!current.ramp || current.ramp != "right-top") if (cx1 != nx1) this.points[this.points.length] = new Point(cx2, cy2);
            if (!current.ramp || current.ramp != "left-top") this.points[this.points.length] = new Point(cx1, cy2);
        }
    }
    if (cx1 < nx2) nx2 = cx1;
    this.points[this.points.length] = new Point(nx2, ny2);
    this.points[this.points.length] = new Point(nx1, ny2);
    return this.points;
}

Polygon.prototype.draw = function(ctx, outline, color, linewidth) {
    drawPolygon(ctx, this.points);
    if (outline) drawPolygonOutline(ctx, this.points, color, linewidth);
}