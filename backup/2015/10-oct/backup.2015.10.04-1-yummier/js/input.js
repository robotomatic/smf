var input = new Input();
document.body.addEventListener("keydown", function (e) { input.keyEvent(e.keyCode, true); });
document.body.addEventListener("keyup", function (e) { input.keyEvent(e.keyCode, false); });

function Input() {
    var keys = new Array();
    this.mapPlayerKeys = function(player, keys) { for (var key in keys) this.mapPlayerKey(key, player, keys[key]); }
    this.mapPlayerKey = function(key, player, action) { keys[key] = new Array(player, action) };    
    this.keyEvent = function(key, val) { if (keys[key]) keys[key][0][keys[key][1]](val); }
}