"use strict";

function CharacterRenderManagerGroup(groupname) {
    this.name = groupname;
    this.index = 0;
    this.parts = new Array();
    this.points = new Array();
    this.rects = new Array();
    this.center = null;
    this.angle =  0;
    this.color = "";
    this.zindex = 0;
    this.clip = "";
    this.path = "";
    this.debug = false;
    this.draw = true;
    this.link = "";
    this.outline = false;
    this.linktype = "";
    this.pointinfo = {};
    this.line = new Line();
}

CharacterRenderManagerGroup.prototype.reset = function() {
    this.parts.length = 0;
    this.points.length = 0;
    this.rects.length = 0;
    this.center = null;
    this.angle = 0;
    this.color = "";
    this.zindex = 0;
    this.clip = "";
    this.path = "";
    this.debug = false;
    this.draw = true;
    this.link = "";
    this.outline = false;
    this.linktype = "";
    this.pointinfo = {};
}


CharacterRenderManagerGroup.prototype.rotate = function(deg, center) {
    for (var i = 0; i < this.points.length; i++) {
        this.line.start.x = center.x;
        this.line.start.y = center.y;
        this.line.end.x = this.points[i].x;
        this.line.end.y = this.points[i].y;
        this.line = this.line.rotate(deg);
        this.points[i].x = this.line.end.x;
        this.points[i].y = this.line.end.y;
    }
}
