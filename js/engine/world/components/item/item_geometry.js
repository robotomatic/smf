"use strict";

function ItemGeometry() {
    this.projected = new Polygon();
    this.fronts = new Array();
    this.tops = new Array();
    this.sides = new Array();
    this.bottoms = new Array();
    this.visible = {
        top : {
            coverage : new Rectangle(0, 0, 0, 0),
            visible : true
        },
        bottom : {
            coverage : new Rectangle(0, 0, 0, 0),
            visible : true
        },
        left : {
            coverage : new Rectangle(0, 0, 0, 0),
            visible : true
        },
        right : {
            coverage : new Rectangle(0, 0, 0, 0),
            visible : true
        },
        front : {
            coverage : new Rectangle(0, 0, 0, 0),
            visible : true
        },
        back : {
            coverage : new Rectangle(0, 0, 0, 0),
            visible : true
        }
    };
}

ItemGeometry.prototype.copy = function(geometry) {
    geometry.visible.top.visible = this.visible.top.visible;
    geometry.visible.bottom.visible = this.visible.bottom.visible;
    geometry.visible.left.visible = this.visible.left.visible;
    geometry.visible.right.visible = this.visible.right.visible;
    geometry.visible.back.visible = this.visible.back.visible;
    geometry.visible.front.visible = this.visible.front.visible;
    return geometry;
}


ItemGeometry.prototype.initialize = function(item) {
    this.visible.top.coverage.initialize(item.x, item.y, item.z, item.width, item.height, item.depth);
    this.visible.bottom.coverage.initialize(item.x, item.y, item.z, item.width, item.height, item.depth);
    this.visible.left.coverage.initialize(item.x, item.y, item.z, item.width, item.height, item.depth);
    this.visible.right.coverage.initialize(item.x, item.y, item.z, item.width, item.height, item.depth);
    this.visible.front.coverage.initialize(item.x, item.y, item.z, item.width, item.height, item.depth);
    this.visible.back.coverage.initialize(item.x, item.y, item.z, item.width, item.height, item.depth);
}

