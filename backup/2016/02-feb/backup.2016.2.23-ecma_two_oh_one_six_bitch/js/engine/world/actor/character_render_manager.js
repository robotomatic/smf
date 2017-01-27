"use strict";

function CharacterRenderManager() {
    this.groups = new Array();
}

CharacterRenderManager.prototype.reset = function() { 
    this.groups.length = 0;
}

CharacterRenderManager.prototype.drawCharacterParts = function(box, parts, pad, color) { 
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
        var part = keys[i];
        if (part.draw == false) continue;
        this.drawCharacterPart(box, part, parts[part], pad, color);
    }
}

CharacterRenderManager.prototype.drawCharacterPart = function(box, partname, part, pad, color) {
    if (part.draw === false && !part.link) return;
    if (part.group) this.drawGroup(box, part, pad, color);
    else if (part.height && part.width) this.drawPart(box, partname, part, pad, color);
    if (part.parts) {
        color = (part.color) ? part.color : color;
        if (part.group) this.drawGroup(box, part.parts, pad, color);
        else this.drawCharacterParts(box, part.parts, pad, color);
    }
}

CharacterRenderManager.prototype.drawGroup = function(box, parts, addpad, color) {
    var group = null;
    for (var i = 0; i < this.groups.length; i++) {
        if (this.groups[i].name == parts.group) {
            group = this.groups[i];
            break;
        }
    }
    if (!group){
        group = { name : parts.group, points : new Array(), rects : new Array() };  
        this.groups[this.groups.length] = group;
    } 
    var pad = .8 + addpad;
    if (parts.width && parts.height) this.addCharacterGroupPart(parts, box, pad, group);
    else {
        if (parts.parts) {
            var keys = Object.keys(parts.parts);
            for (var i = 0; i < keys.length; i++) this.addCharacterGroupPart(parts.parts[keys[i]], box, pad, group);
        }
    }
    if (parts.angle) group.angle = parts.angle;
    if (parts.draw == false) group.draw = false;
}

CharacterRenderManager.prototype.drawPart = function(box, partname, part, addpad, color) {
    if (part.draw === false && !part.link) return;
    var g = partname;
    var group = null;
    for (var num = 0; num < this.groups.length; num++) {
        if (this.groups[num].name == g) {
            group = this.groups[num];
            break;
        }
    }
    if (!group){
        group = { name : g, points : new Array(), rects : new Array() };  
        var num = this.groups.length;
        this.groups[num] = group;
    } 
    var pad = .8 + addpad;
    this.addCharacterGroupPart(part, box, pad, group);
    group.color = part.color ? part.color : color;
    if (part.zindex || part.zindex == 0) group.zindex = part.zindex;
    else group.zindex = 1000 + num;
    if (part.parts) this.updateGroup(part.parts, group.color, part.zindex);
    if (part.clip) group.clip = part.clip;
    if (part.path) group.path = part.path;
    if (part.debug) group.debug = part.debug;
    if (part.draw == false) group.draw = false;
    if (part.link) group.link = part.link;
    if (part.linktype) group.linktype = part.linktype;
    if (part.pointinfo) group.pointinfo = part.pointinfo;
}

CharacterRenderManager.prototype.addCharacterGroupPart = function(part, box, pad, group) {
    var part_height = box.height * ((part.height + pad) / 100);
    var part_width = box.width * ((part.width + pad) / 100);
    var part_x = box.x + (box.width * ((part.x - (pad / 2)) / 100));
    var part_y = box.y + (box.height * ((part.y - (pad / 2)) / 100));
    group.rects[group.rects.length] = new Rectangle(part_x, part_y, part_width, part_height);
    var current = group.points.length; 
    group.points[group.points.length] = new Point(part_x, part_y);
    group.points[group.points.length] = new Point(part_x + part_width, part_y);
    group.points[group.points.length] = new Point(part_x + part_width, part_y + part_height);
    group.points[group.points.length] = new Point(part_x, part_y + part_height);
    if (part.pointinfo) {
        var k = Object.keys(part.pointinfo);
        for (var i = 0; i < k.length; i++) {
            group.points[current + Number(k[i])].setInfo(part.pointinfo[k[i]]);
        }
    }
    if (part.angle) {
        group.angle = part.angle;
        var cp = new Point(part_x + (part_width / 2), part_y + (part_height / 2));
        group.center = cp;
        if (part.parts) group.parts = part.parts;
    }
}

CharacterRenderManager.prototype.updateGroup = function(parts, color, zindex) {
    var keys = Object.keys(parts);
    for (var i = 0; i < keys.length; i++) {
        var part = parts[keys[i]];
        part.zindex = ++zindex;
        if (!part.color) part.color = color;
        if (part.parts) this.updateGroup(part.parts, color, zindex);
    }
}
