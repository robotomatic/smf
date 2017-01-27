"use strict";

function initializeDevQuality() {
    document.getElementById("dev-quality-player").onchange = function() {
        setQualityPlayer(this.value);
    };
    document.getElementById("dev-quality-player-range").onchange = function() {
        setQualityPlayer(this.value);
    };
    document.getElementById("dev-quality-level").onchange = function() {
        setQualityLevel(this.value);
    };
    document.getElementById("dev-quality-level-range").onchange = function() {
        setQualityLevel(this.value);
    };
}

function setQualityPlayer(quality) {
    setQuality("playerquality", quality);
}

function setQualityLevel(quality) {
    setQuality("levelquality", quality, true);
}

function setQuality(what, quality, reset = false) {
    if (!gamecontroller || !gamecontroller.game) return;
    if (Array.isArray(gamecontroller.game) || gamecontroller.game.loop.game.views.length == 0) return;
    var vv = gamecontroller.game.loop.game.views[0];
    var v = vv.view;
    v.renderer[what] = Number(quality);
    if (reset) gamecontroller.game.loop.reset(timestamp());
    updateDevViewQuality(v);
}

function updateDevViewQuality(v) {
    var pq = v.renderer.playerquality;
    var pp = document.getElementById("dev-quality-player");
    pp.value = pq;
    var ppp = document.getElementById("dev-quality-player-range");
    ppp.value = pq;
    
    var lq = v.renderer.levelquality;
    var ll = document.getElementById("dev-quality-level");
    ll.value = lq;
    var lll = document.getElementById("dev-quality-level-range");
    lll.value = lq;
}
