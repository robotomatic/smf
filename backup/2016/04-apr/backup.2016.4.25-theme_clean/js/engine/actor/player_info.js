"use strict";

function PlayerInfo(player, hp, listener) {
    this.player = player;
    this.maxhp = hp;
    this.hp = hp;
    this.lastdamage = null;
    this.damagedthreshold = 2;
    this.alive = true;
    this.ready = false;
    this.set = false;
    this.listener = listener;
}

PlayerInfo.prototype.respawn = function(x, y) {
    this.ready = false;
    this.set = false;
}

PlayerInfo.prototype.reset = function() {
    this.alive = true;
    this.ready = true;
    this.hp = this.maxhp;
}

PlayerInfo.prototype.damage = function(amount) {
    this.lastdamage = timestamp();
    this.hp -= amount;
    if (this.hp <= 0) this.die();
}

PlayerInfo.prototype.die = function() {
    var alive = this.alive;
    this.alive = false;
    this.lastdamage = null;
    if (alive && this.listener) this.listener.playerDied(this.player);
}

PlayerInfo.prototype.isDamaged = function() {
    if (!this.alive || !this.ready) return false;
    if (!this.lastdamage) return false;
    var now = timestamp();
    var dt = (now - this.lastdamage) / 1000;
    return dt <= this.damagedthreshold;
}
