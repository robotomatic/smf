"use strict";

function CharacterRenderManager() {
    this.groups = new Array();
    this.groupnames = {};
    this.loaded = false;
}

CharacterRenderManager.prototype.updateCharacter = function(box, parts, pad, color) {
    if (this.groups.length) this.resetCharacterParts(box, parts, pad, color);
    else this.updateCharacterParts(box, parts, pad, color);
    this.loaded = true;
}

CharacterRenderManager.prototype.resetCharacterParts = function(box, parts, pad, color) {
    this.groups.length = 0;
    this.groupnames = {};
    this.updateCharacterParts(box, parts, pad, color);
}

CharacterRenderManager.prototype.updateCharacterParts = function(box, parts, pad, color) { 
    var keys = parts.keys;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == "keys" || keys[i] == "groups") continue;
        var part = keys[i];
        if (part.draw == false) continue;
        this.updateCharacterPart(box, part, parts[part], pad, color);
    }
}

CharacterRenderManager.prototype.updateCharacterPart = function(box, partname, part, pad, color) {
    if (part.draw === false && !part.link) return;
    if (part.group) this.updateCharacterGroup(box, part, pad, color);
    else if (part.height && part.width) this.updatePart(box, partname, part, pad, color);
    if (part.parts) {
        color = (part.color) ? part.color : color;
        if (part.group) this.updateCharacterGroup(box, part.parts, pad, color);
        else this.updateCharacterParts(box, part.parts, pad, color);
    }
}

CharacterRenderManager.prototype.updateCharacterGroup = function(box, parts, addpad, color) {
    if (!parts.group) return;
    var group = this.getGroup(parts.group);
    var pad = .8 + addpad;
    if (parts.width && parts.height) this.addCharacterGroupPart(parts, box, pad, group, color);
    else {
        if (parts.parts) {
            var keys = parts.parts.keys;
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == "keys" || keys[i] == "groups") continue;
                this.addCharacterGroupPart(parts.parts[keys[i]], box, pad, group, color);
            }
        }
    }
    if (parts.angle) group.angle = parts.angle;
    if (parts.draw == false) group.draw = false;
}

CharacterRenderManager.prototype.updatePart = function(box, partname, part, addpad, color) {
    if (part.draw === false && !part.link) return;
    var group = this.getGroup(partname);
    var pad = .8 + addpad;
    this.addCharacterGroupPart(part, box, pad, group, color);
}

CharacterRenderManager.prototype.getGroup = function(groupname) {
    if (this.groupnames[groupname]) return this.groupnames[groupname];
    var group = { 
        name : groupname, 
        points : new Array(), 
        rects : new Array(),
        center : null,
        angle : 0,
        color : "",
        zindex : 0,
        clip : "",
        path : "",
        debug : false,
        draw : true,
        link : "",
        outline : false,
        linktype : "",
        pointinfo : {}
    };  
    this.groupnames[groupname] = group;
    this.groups[this.groups.length] = group;
    return group;
}

CharacterRenderManager.prototype.addCharacterGroupPart = function(part, box, pad, group, color) {
    
    var part_height = box.height * ((part.height + pad) / 100);
    var part_width = box.width * ((part.width + pad) / 100);
    
    var part_x = round(box.x + (box.width * ((part.x - (pad / 2)) / 100)));
    var part_y = round(box.y + (box.height * ((part.y - (pad / 2)) / 100)));
    
    // todo: can I cache this stuff?
    group.rects[group.rects.length] = geometryfactory.getRectangle(part_x, part_y, part_width, part_height);
    
    var current = group.points.length; 
    group.points[group.points.length] = geometryfactory.getPoint(part_x, part_y);
    group.points[group.points.length] = geometryfactory.getPoint(part_x + part_width, part_y);
    group.points[group.points.length] = geometryfactory.getPoint(part_x + part_width, part_y + part_height);
    group.points[group.points.length] = geometryfactory.getPoint(part_x, part_y + part_height);
    if (part.pointinfo) {
        var k = Object.keys(part.pointinfo);
        for (var i = 0; i < k.length; i++) {
            group.points[current + Number(k[i])].setInfo(part.pointinfo[k[i]]);
        }
    }
    if (part.angle) {
        group.angle = part.angle;
        var cpx = part_x + (part_width / 2);
        var cpy = part_y + (part_height / 2);
        var cp = geometryfactory.getPoint(cpx, cpy);
        group.center = cp;
        if (part.parts) {
            group.parts = part.parts;
        }
    }
    group.color = part.color ? part.color : color;
    if (part.zindex || part.zindex == 0) group.zindex = part.zindex;
    else group.zindex = 1000 + this.groups.length;
    if (part.outline) {
        group.outline = part.outline;
        if (part.parts) this.updateGroupOutline(part.parts, part.outline);
    }
    if (part.mask) group.mask = part.mask;
    if (part.parts) this.updateGroup(part.parts, group.color, part.zindex);
    if (part.clip) group.clip = part.clip;
    if (part.path) group.path = part.path;
    if (part.debug) group.debug = part.debug;
    if (part.draw == false) group.draw = false;
    if (part.link) group.link = part.link;
    if (part.linktype) group.linktype = part.linktype;
    if (part.pointinfo) group.pointinfo = part.pointinfo;
}

CharacterRenderManager.prototype.updateGroup = function(parts, color, zindex) {
    var keys = parts.keys;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == "keys" || keys[i] == "groups") continue;
        var part = parts[keys[i]];
        part.zindex = ++zindex;
        if (!part.color) part.color = color;
    }
}

CharacterRenderManager.prototype.updateGroupOutline = function(parts, outline) {
    var keys = parts.keys;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == "keys" || keys[i] == "groups") continue;
        var part = parts[keys[i]];
        part.outline = outline;
        if (part.parts) this.updateGroupOutline(part.parts, outline);
    }
}
