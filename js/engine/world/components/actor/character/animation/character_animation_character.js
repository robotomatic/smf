"use strict";

function CharacterAnimationCharacter() {
    this.animbox = new Rectangle(0, 0, 0, 0);;
    this.animchar = null;
    this.indexchar = null;
}

CharacterAnimationCharacter.prototype.initialize = function(character) {
    
    this.animbox.x = 0;
    this.animbox.y = 0;
    this.animbox.width = character.width;
    this.animbox.height = character.height;
    
    if (!this.animchar) {
        this.animchar = JSON.parse(JSON.stringify(character.parts));
        this.updateCharacterKeys(this.animchar);
    }
    
    if (!this.indexchar) {
        this.indexchar = new Array();
        this.indexCharacterPuppetParts(this.animchar);
        this.updateCharacterKeys(this.indexchar);
    } else {
        this.resetCharacterPuppet();
    }
}

CharacterAnimationCharacter.prototype.updateCharacterKeys = function(parts) {
    var keys = Object.keys(parts);
    if (!keys.length) return;
    parts.keys = new Array();
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        if (keys[i] == "groups" || keys[i] == "keys") continue;
        var key = keys[i];
        parts.keys[parts.keys.length] = key;
        var part = parts[key];
        if (part.parts) this.updateCharacterKeys(part.parts);
    }
}

CharacterAnimationCharacter.prototype.indexCharacterPuppetParts = function(parts) {
    var p = Object.keys(parts);
    var t = p.length;
    for (var i = 0 ; i < t; i++) {
        if (p[i] == "pad" || p[i] == "keys" || p[i] == "group") continue;
        var pp = parts[p[i]];
        pp.reset = new CharacterAnimationInfo();
        pp.reset.box = new Rectangle(pp.x, pp.y, pp.width, pp.height);
        pp.reset.angle = pp.angle;
        pp.reset.draw = pp.draw;
        pp.reset.zindex = pp.zindex;
        pp.reset.outline = pp.outline;
        pp.reset.pointinfo = pp.pointinfo;
        pp.reset.color = pp.color;
        
        pp.last = new CharacterAnimationInfo();
        pp.last.box = new Rectangle(pp.x, pp.y, pp.width, pp.height);
        pp.last.angle = 0;
        
        this.indexchar[p[i]] = pp;
        if (pp.parts) this.indexCharacterPuppetParts(pp.parts);
    }
}

CharacterAnimationCharacter.prototype.resetCharacterPuppet = function() {
    var p = this.indexchar.keys;
    var t = p.length;
    for (var i = 0 ; i < t; i++) {
        if (p[i] == "keys" || p[i] == "group") continue;
        var pp = this.indexchar[p[i]];
        
        pp.last.box.x = pp.x;
        pp.last.box.y = pp.y;
        pp.last.box.width = pp.width;
        pp.last.box.height = pp.height;
        pp.last.angle = pp.angle;
        
        pp.x = pp.reset.box.x;
        pp.y = pp.reset.box.y;
        pp.width = pp.reset.box.width;
        pp.height = pp.reset.box.height;
        pp.angle = pp.reset.angle;
        
        pp.draw = pp.reset.draw;
        pp.zindex = pp.reset.zindex;
        pp.outline = pp.reset.outline;
        pp.pointinfo = pp.reset.pointinfo;
        pp.color = pp.reset.color;
    }
}