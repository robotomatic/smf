Item = function() {
    
    this.id = "";

    this.name = "";
    
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    this.radius = "";
    this.ramp = "";
    this.angle = "";
    
    this.collide = "";
    this.draw = true;
    this.animate = false;
    
    this.itemtype = "";
    
    this.actions = null;
    this.parts = null;
}

Item.prototype.loadJson = function(json) {

    var name = json.name ? json.name : "default";
    this.name = name;
    
    var itemtype = json.itemtype ? json.itemtype : "default";
    this.itemtype = itemtype;
    
    this.x = json.x;
    this.y = json.y;
    this.width = json.width;
    this.height = json.height;
    
    this.id = this.name + "_" + this.itemtype + "_" + this.x + "_" + this.y + "_" + this.width + "_" + this.height;

    this.radius = json.radius;
    this.ramp = json.ramp;
    this.angle = json.angle;
    
    this.collide = json.collide;
    this.draw = json.draw;
    this.animate = json.animate;
    
    this.actions = json.actions;
    this.parts = json.parts;
}