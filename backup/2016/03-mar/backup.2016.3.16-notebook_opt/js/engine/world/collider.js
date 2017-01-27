"use strict";

function Collider() {
    this.vertical = {
        direction : "",
        amount : 0,
        y : null
    }
    this.horizontal = {
        direction : "",
        amount : 0
    };
}

Collider.prototype.collided = function() {
    return this.vertical.amount > 0 || this.horizontal.amount > 0 || this.vertical.direction != "" || this.horizontal.direction != "";
}

Collider.prototype.reset = function() {
    this.vertical.direction = "";
    this.vertical.amount = 0;
    this.vertical.y = null;
    this.horizontal.direction = "";
    this.horizontal.amount = 0;
}