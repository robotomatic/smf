"use strict";

var devplayers;

var dev_template = null;


function initializeDevPlayers() {
    
    if (!__dev) return;
    
    devplayers = new Array();
    dev_template = document.getElementById("dev-dialog-players-players-player-template");
}

function resetDevPlayers(players) {
    
    // todo: remove all players that aren't active
    // todo: hide all player dialogs that aren't active
    updateDevPlayers(players.players);
    
}

function devPlayersAddPlayer(player) {
    
    if (!__dev) return;
    
    var id = player.id;
    if (!devplayers || devplayers[id]) return;
    
    var name = player.name;
    
    var template = dev_template;
    if (!template) return;
    
    var item = template.cloneNode(true);
    item.id = "dev-dialog-players-players-player-" + id;
    item.style.display = "block";

    var pid = item.children.item(0);
    pid.id = "dev-dialog-players-players-player-id-" + id;
    
    var pname = item.children.item(1);
    pname.id = "dev-dialog-players-players-player-name-" + id;
    pname.innerHTML = name;
    pname.onclick = function(e) {
        showDevPlayer(player);
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
    
    var pdel = item.children.item(2);
    pdel.id = "dev-dialog-players-players-player-remove-" + id;
    pdel.onclick = function(e) {
        devRemovePlayersPlayer(player);
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    var pcam = item.children.item(3);
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




function updateDevPlayers(players) {
    if (!__dev) return;
    if (!devplayers) return;
    for (var i = 0; i < players.length; i++) updateDevPlayersPlayer(players[i]);
}

function updateDevPlayersPlayer(player) {
    if (!__dev) return;
    if (!devplayers) return;
    var id = player.id;
    if (!devplayers[id]) devPlayersAddPlayer(player);
    devPlayersUpdatePlayer(player);
}

function devPlayersUpdatePlayer(player) {
    if (!__dev) return;
    var id = player.id;
    var item = devplayers[id];
    if (!item) return;
}

function devPlayersUpdatePlayerCamera(id, check) {
    if (!__dev) return;
    var player = devplayers[id];
    if (!player) return;
    player.player.getscamera = check;
}



function devRemovePlayersPlayer(player) {
    var id = player.id;
    var div = document.getElementById("dev-dialog-players-players-player-" + player.id);
    if (div) div.parentNode.removeChild(div);
    delete devplayers[id];
    devRemovePlayer(player);
}
