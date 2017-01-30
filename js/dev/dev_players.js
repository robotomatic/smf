"use strict";

var devplayers = new Array();

function initializeDevPlayers() {
    
}

function updateDevPlayers(players) {
    for (var i = 0; i < players.length; i++) updateDevPlayersPlayer(players[i]);
}

function updateDevPlayersPlayer(player) {
    var id = player.id;
    if (!devplayers[id]) devPlayersAddPlayer(player);
    devPlayersUpdatePlayer(player);
}

function devPlayersAddPlayer(player) {

    var id = player.id;
    var name = player.name;
    
    var template = document.getElementById("dev-dialog-players-players-player-template");
    if (!template) return;
    
    var item = template.cloneNode(true);
    item.id = "dev-dialog-players-players-player-" + id;
    item.style.display = "block";

    var pid = item.children.item(0);
    pid.id = "dev-dialog-players-players-player-id-" + id;
    
    var pname = item.children.item(1);
    pname.id = "dev-dialog-players-players-player-name-" + id;
    pname.innerHTML = name;
    
    var pcam = item.children.item(2);
    pcam.id = "dev-dialog-players-players-player-camera-" + id;
    var pcamlabel = pcam.children.item(0);
    var pcamlabelcam = pcamlabel.children.item(0);
    pcamlabelcam.id = "dev-dialog-players-players-player-camera-camera-" + id;
    pcamlabelcam.checked = player.getscamera;
    
    pcamlabelcam.onchange = function() {
        var id = this.id.replace("dev-dialog-players-players-player-camera-camera-", "");
        var check = this.checked;
        devPlayersUpdatePlayerCamera(id, check);
    };
    
    var list = document.getElementById("dev-dialog-players-players");
    list.appendChild(item);

    devplayers[id] = {
        player : player,
        item : item
    }
}
    
function devPlayersUpdatePlayer(player) {
    var id = player.id;
    var item = devplayers[id];
    if (!item) return;
}

function devPlayersUpdatePlayerCamera(id, check) {
    var player = devplayers[id];
    if (!player) return;
    player.player.getscamera = check;
}