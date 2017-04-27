"use strict";

var devplayercharacter;
var dev_player_character_template = null;

function initializeDevPlayerCharacter() {
    if (!__dev) return;
    devplayercharacter = new Array();
    dev_player_character_template = document.getElementById("dev-dialog-player-character");
}


function showDevPlayerCharacter(player) {
    if (!__dev) return;
    var pid = "dev-dialog-players-player-character-" + player.uid;
    var pcd = devplayercharacter[pid];
    if (!devplayercharacter[pid]) {
        pcd = createDevPlayerCharacterDialog(player, pid);
        devplayercharacter[pid] = pcd;
    }
    pcd.visible = true;
    updateDevPlayerCharacter(player);
    toggleDevDialog(pid, false);
}

function createDevPlayerCharacterDialog(player, pid) {
    
    var id = player.uid;
    
    var pd = dev_player_character_template.cloneNode(true);
    pd.id = pid;

    var close = findChildById(pd, "dev-dialog-player-character-close");
    if (close) {
        close.onclick = function() {
            devplayercharacter[pid].visible = false;
        }
    }
    
    var title = findChildById(pd, "dev-dialog-player-character-title");
    if (title) {
        title.innerHTML = player.name;
        title.id = "dev-dialog-player-character-title-" + id;
    }
    
    
    var gamecanvas = null;
    var canvasdiv = findChildById(pd, "dev-debug-player-character-canvas");
    if (canvasdiv) {
        canvasdiv.id = "dev-dialog-player-character-canvas-" + id;
        gamecanvas = new GameCanvas("");
        gamecanvas.setClassName("dialog-canvas");
        gamecanvas.attach(canvasdiv);
    }
    
    document.getElementById("main-content").appendChild(pd);
    
    return {
        dialog : pd,
        visible : false,
        gamecanvas : gamecanvas
    };
    
}





function removeDevPlayerCharacterId(playerid) {
    var pid = "dev-dialog-players-player-character-" + playerid;
    var dialog = document.getElementById(pid);
    if (dialog) dialog.parentNode.removeChild(dialog);
    delete devplayercharacter[pid];   
    removeDevDialog(pid);
}

























function updateDevPlayerCharacter(player) {
    if (!__dev) return;
}


function updateDevPlayerCharacterImage(player) {
    if (!__dev) return;
    var pid = "dev-dialog-players-player-character-" + player.uid;
    var pcd = devplayercharacter[pid];
    if (!pcd) return;
    if (!pcd.visible) return;
    var gc = player.gamecanvas;
    var gcw = gc.width;
    var gch = gc.height;
    var gcr = gcw / gch;
    var cnv = pcd.gamecanvas;
    cnv.clear();
    var ch = cnv.canvas.height;
    var cw = ch * gcr;
    var cx = (cnv.canvas.width - cw) / 2;
    var cy = (cnv.canvas.height - ch) / 2;
    cnv.drawImage(player.gamecanvas, round(cx), round(cy), round(cw), round(ch));
}

