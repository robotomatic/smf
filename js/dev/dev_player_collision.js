function updateDevPlayerCollision(pd, player) {
    if (!__dev) return;
    pd.colfl.value = player.collider.index.front.left != undefined ? player.collider.index.front.left : "";
    pd.colfr.value = player.collider.index.front.right != undefined ? player.collider.index.front.right : "";
    pd.colbl.value = player.collider.index.back.left != undefined ? player.collider.index.back.left : "";
    pd.colbr.value = player.collider.index.back.right != undefined ? player.collider.index.back.right : "";
}
