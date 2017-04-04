"use strict";

var devplayers;

var dev_players_template = null;
var dev_players_list = null;
var dev_players_characters = null;

function initializeDevPlayers() {
    
    if (!__dev) return;
    
    devplayers = new Array();
    dev_players_template = document.getElementById("dev-dialog-players-players-player-template");
    dev_players_list = document.getElementById("dev-dialog-players-players");
    dev_players_characters = document.getElementById("dev-players-add-player-character");
    
    loadDevCharacters();
    
    var addplayer = document.getElementById("dev-players-add-player");
    addplayer.onclick = function() {
        addDevPlayersPlayerCharacter(dev_players_characters.value)
    }
}

function resetDevPlayers(players) {
    loadDevCharacters();
    var keys = Object.keys(devplayers);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var key = keys[i];
        removeDevPlayersPlayerId(key);
    }
    devplayers = new Array();
    updateDevPlayers(players.players);
}


function loadDevCharacters() {
    if (!controller.gameloader.characters) return;
    dev_players_characters.innerHTML = "";
    var chars = controller.gameloader.characters.characters;
    if (!chars) return;
    var keys = Object.keys(chars);
    var t = keys.length;
    for (var i = 0; i < t; i++) {
        var key = keys[i];
        var char = chars[key];
        var opt = document.createElement('option');
        opt.value = key;
        opt.innerHTML = char.name;
        dev_players_characters.appendChild(opt);        
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
    var id = player.uid;
    if (!devplayers[id]) addDevPlayersPlayer(player);
}


function addDevPlayersPlayer(player) {
    
    if (!__dev) return;
    
    var id = player.uid;
    if (!devplayers || devplayers[id]) return;
    
    var name = player.uid;
    
    var template = dev_players_template;
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
        removeDevPlayersPlayer(player);
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
        updateDevPlayersPlayerCamera(id, check);
    };
    
    dev_players_list.appendChild(item);

    devplayers[id] = {
        player : player,
        item : item
    }
}








function updateDevPlayersPlayerCamera(id, check) {
    if (!__dev) return;
    var player = devplayers[id];
    if (!player) return;
    controller.updatePlayerCamera(player.player, check);
}



function removeDevPlayersPlayer(player) {
    controller.removePlayer(player);
    removeDevPlayersPlayerId(player.uid);
}

function removeDevPlayersPlayerId(playerid) {
    var div = document.getElementById("dev-dialog-players-players-player-" + playerid);
    if (div) div.parentNode.removeChild(div);
    delete devplayers[playerid];
    removeDevPlayerId(playerid);
}


function addDevPlayersPlayerCharacter(charname) {
    controller.addPlayer(charname);
}