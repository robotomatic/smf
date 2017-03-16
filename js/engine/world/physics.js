"use strict";

function Physics() {
        this.friction = .8;
        this.airfriction = .1;
        this.gravity = .3;
        this.terminalVelocity = 10;
        this.wallfriction = .5;
};

Physics.prototype.setPhysics = function(physics) {
    if (physics.friction) this.friction = physics.friction;
    if (physics.airfriction) this.airfriction = physics.airfriction;
    if (physics.gravity) this.gravity = physics.gravity;
    if (physics.terminalVelocity) this.terminalVelocity = physics.terminalVelocity;
    if (physics.wallfriction) this.wallfriction = physics.wallfriction;
}
