function updateDevPlayerCollision(pd, player) {
    if (!__dev) return;
    var val = "";
    var collisions = player.collider.index;
    var keys = Object.keys(collisions);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        if (val) val += "\n";
        val += keys[i];
    }
    pd.collisions.value = val;
}
