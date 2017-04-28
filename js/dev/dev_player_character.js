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
        title.innerHTML = player.name + ": " + player.character.name;
        title.id = "dev-dialog-player-character-title-" + id;
    }

    var hidef = findChildById(pd, "dev-player-character-hidef");
    if (hidef) {
        hidef.id = "dev-player-character-hidef-" + id;
        hidef.onclick = function() {
            setPlayerHiDef(player, this.checked);
        }
    }

    var debugchar = findChildById(pd, "dev-player-character-debug-character");
    if (debugchar) {
        debugchar.id = "dev-player-character-debug-character-" + id;
        debugchar.onclick = function() {
            setPlayerCharacterDebugCharacter(player, this.checked);
        }
    }
    
    var debugguts = findChildById(pd, "dev-player-character-debug-guts");
    if (debugguts) {
        debugguts.id = "dev-player-character-debug-guts-" + id;
        debugguts.onclick = function() {
            setPlayerCharacterDebugGuts(player, this.checked);
        }
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
        tite : title,
        hidef : hidef,
        debugchar : debugchar,
        debugguts : debugguts,
        gamecanvas : gamecanvas
    };
    
}



function changeDevPlayerCharacterCharacter(player, char) {
    if (!__dev) return;
    var pid = "dev-dialog-players-player-character-" + player.uid;
    var pcd = devplayercharacter[pid];
    if (!pcd) return;
    title.innerHTML = player.name + ": " + player.character.name;
}


function removeDevPlayerCharacterId(playerid) {
    var pid = "dev-dialog-players-player-character-" + playerid;
    var dialog = document.getElementById(pid);
    if (dialog) dialog.parentNode.removeChild(dialog);
    delete devplayercharacter[pid];   
    removeDevDialog(pid);
}










function setPlayerHiDef(player, hidef) {
    player.hidef = hidef;
}


function updatePlayerHiDef(player) {
    if (!__dev) return;
    var pid = "dev-dialog-players-player-character-" + player.uid;
    var pcd = devplayercharacter[pid];
    if (!pcd) return;
    if (!pcd.visible) return;
    pcd.hidef.checked = player.hidef;
}








function setPlayerCharacterDebugCharacter(player, char) {
    player.debug.character = char;
}

function updatePlayerCharacterDebugCharacter(player) {
    if (!__dev) return;
    var pid = "dev-dialog-players-player-character-" + player.uid;
    var pcd = devplayercharacter[pid];
    if (!pcd) return;
    if (!pcd.visible) return;
    pcd.debugchar.checked = player.debug.character;
}




function setPlayerCharacterDebugGuts(player, guts) {
    player.debug.guts = guts;
}

function updatePlayerCharacterDebugGuts(player) {
    if (!__dev) return;
    var pid = "dev-dialog-players-player-character-" + player.uid;
    var pcd = devplayercharacter[pid];
    if (!pcd) return;
    if (!pcd.visible) return;
    pcd.debugguts.checked = player.debug.guts;
}








function updateDevPlayerCharacter(player) {
    if (!__dev) return;
    updatePlayerHiDef(player);
    updatePlayerCharacterDebugCharacter(player);
    updatePlayerCharacterDebugGuts(player);
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
    var cnv = pcd.gamecanvas;
    var cch = cnv.canvas.clientHeight;
    var ccw = cnv.canvas.clientWidth;
    cnv.canvas.height = cch;
    cnv.canvas.width = ccw;
    var ratio = gch / gcw;
    var cw = ccw;
    var ch = cw * ratio;
    if (ch > cch) {
        var or = gcw / gch;
        ch = cch;
        cw = ch * or;
    }
    var cx = (cnv.canvas.width - cw) / 2;
    var cy = (cnv.canvas.height - ch) / 2;
    cnv.drawImage(player.gamecanvas, round(cx), round(cy), round(cw), round(ch));
}

