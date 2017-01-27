function Input() {
    var keys = new Array();
    this.mapPlayerKeys = function(player, keys) { for (var key in keys) this.mapPlayerKey(key, player, keys[key]); }
    this.mapPlayerKey = function(key, player, action) { keys[key] = new Array(player, action) };    
    this.keyEvent = function(key, val) { if (keys[key]) keys[key][0][keys[key][1]](val); }
}