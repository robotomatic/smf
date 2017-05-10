"use strict";

function CharacterRenderManager() {
    this.groups = new Array();
    this.groupnames = {};
}

CharacterRenderManager.prototype.updateCharacter = function(character) {
    if (this.groups.length) this.resetCharacterGroups();
    
    this.updateCharacterParts(character, character.parts.parts, "");
    
    if (!character.groups) return;
    
    for (var i = 0; i < this.groups.length; i++) {
        var group = this.groups[i];
        var name = group.name;
        var groupdef = character.groups[name];
        if (!groupdef || groupdef.draw == false) continue;
        var z = 100;
        if (groupdef.zindex || groupdef.zindex == 0) z = groupdef.zindex;
        this.groups[i].zindex  = z;
    }
}

CharacterRenderManager.prototype.resetCharacterGroups = function() {
    var t = this.groups.length;
    for (var i = 0; i < t; i++) {
        this.groups[i].reset();
    }
}




CharacterRenderManager.prototype.updateCharacterParts = function(character, parts, color) { 
    var keys = parts.keys;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == "keys" || keys[i] == "groups") continue;
        var part = keys[i];
        if (part.draw == false) continue;
        this.updateCharacterPart(character, part, parts[part], color);
    }
}

CharacterRenderManager.prototype.updateCharacterPart = function(character, partname, part, color) {
    if (part.draw === false && !part.link) return;
    if (!part.color) part.color = color;
    if (part.group) this.updateCharacterGroup(character, part);
    else if (part.height && part.width) this.updatePart(character, partname, part);
    if (part.parts) {
        if (part.group) this.updateCharacterGroup(character, part.parts);
        else this.updateCharacterParts(character, part.parts, part.color);
    }
}

CharacterRenderManager.prototype.updateCharacterGroup = function(character, parts) {
    if (!parts.group) return;
    var group = this.getGroup(parts.group);
    if (parts.width && parts.height) this.addCharacterGroupPart(character, parts, group);
    else {
        if (parts.parts) {
            var keys = parts.parts.keys;
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == "keys" || keys[i] == "groups") continue;
                this.addCharacterGroupPart(character, parts.parts[keys[i]], group);
            }
        }
    }
    if (parts.angle) group.angle = parts.angle;
    if (parts.draw == false) group.draw = false;
}

CharacterRenderManager.prototype.updatePart = function(character, partname, part) {
    if (part.draw === false && !part.link) return;
    var group = this.getGroup(partname);
    this.addCharacterGroupPart(character, part, group);
}

CharacterRenderManager.prototype.getGroup = function(groupname) {
    if (this.groupnames[groupname]) {
        var g = this.groupnames[groupname];
        return g;
    }
    var group = new CharacterRenderManagerGroup(groupname);
    this.groupnames[groupname] = group;
    this.groups[this.groups.length] = group;
    group.index = this.groups.length;
    return group;
}

CharacterRenderManager.prototype.addCharacterGroupPart = function(character, part, group) {
    
    var box = character.mbr;

    //
    // TODO: Nice to remove this someday...
    //
    var pad = 0.8;
    
    var part_height = box.height * ((part.height + pad) / 100);
    var part_width = box.width * ((part.width + pad) / 100);    
    var part_x = round(box.x + (box.width * ((part.x - (pad / 2)) / 100)));
    var part_y = round(box.y + (box.height * ((part.y - (pad / 2)) / 100)));    
    
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
    
    var color = part.color ? part.color : character.color;
    group.color = color;
    
    if (part.zindex || part.zindex == 0) group.zindex = part.zindex;
    else group.zindex = 1000 + group.index;

    if (part.mask) group.mask = part.mask;
    if (part.parts) this.updateGroup(character, part.parts, group.color, part.zindex);
    if (part.clip) group.clip = part.clip;
    if (part.path) group.path = part.path;
    if (part.debug) group.debug = part.debug;
    if (part.draw == false) group.draw = false;
    if (part.link) group.link = part.link;
    if (part.linktype) group.linktype = part.linktype;
    if (part.pointinfo) group.pointinfo = part.pointinfo;
}

CharacterRenderManager.prototype.updateGroup = function(character, parts, color, zindex) {
    var keys = parts.keys;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == "keys" || keys[i] == "groups") continue;
        var part = parts[keys[i]];
        part.zindex = ++zindex;
        if (!part.color) part.color = color;
    }
}



