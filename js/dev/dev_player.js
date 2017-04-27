"use strict";

var devplayer;
var dev_player_template = null;

function initializeDevPlayer() {
    if (!__dev) return;
    devplayer = new Array();
    dev_player_template = document.getElementById("dev-dialog-player");
    initializeDevPlayerCharacter();
}

function showDevPlayer(player) {
    if (!__dev) return;
    var pid = "dev-dialog-players-player-" + player.uid;
    var pd = devplayer[pid];
    if (!devplayer[pid]) {
        pd = createDevPlayerDialog(player, pid);
        devplayer[pid] = pd;
    }
    pd.visible = true;
    updateDevPlayer(player);
    toggleDevDialog(pid, false);
}

function createDevPlayerDialog(player, pid) {
    if (!__dev) return;

    var id = player.uid;
    
    var pd = dev_player_template.cloneNode(true);
    pd.id = pid;

    var close = findChildById(pd, "dev-dialog-player-close");
    if (close) {
        close.onclick = function() {
            devplayer[pid].visible = false;
        }
    }
    
    var title = findChildById(pd, "dev-dialog-player-title");
    if (title) {
        title.innerHTML = player.name;
        title.id = "dev-dialog-player-title-" + id;
    }
    
    
    var char = findChildById(pd, "dev-player-character-character");
    if (char) {
        char.id = "dev-player-character-character-" + id;
        char.onclick = function(e) {
            showDevPlayerCharacter(player);
            e.stopPropagation()
            e.preventDefault();
            return false;
        }
    }
    
    
    var playerchar = findChildById(pd, "dev-player-character");
    if (playerchar) {
        playerchar.id = "dev-player-character-" + id;
        var chars = controller.gameloader.characters.characters;
        if (chars) {
            var keys = Object.keys(chars);
            var t = keys.length;
            for (var i = 0; i < t; i++) {
                var key = keys[i];
                var char = chars[key];
                var opt = document.createElement('option');
                opt.value = key;
                opt.innerHTML = char.name;
                if (char.name == player.character.name) opt.selected = true;
                playerchar.appendChild(opt);        
            }
        }
        playerchar.onchange = function(e) {
            changeDevPlayerCharacter(player, playerchar.value);
            e.stopPropagation()
            e.preventDefault();
            return false;
        }
    }

    var debugplayerx = findChildById(pd, "dev-player-position-x");
    if (debugplayerx) {
        debugplayerx.id = "dev-player-position-x-" + id;
        debugplayerx.onchange = function() {
            setDevPlayerX(player, this.value);
        }
        handleDevFocus(debugplayerx);
    }
    var debugplayery = findChildById(pd, "dev-player-position-y");
    if (debugplayery) {
        debugplayery.id = "dev-player-position-y-" + id;
        debugplayery.onchange = function() {
            setDevPlayerY(player, this.value);
        }
        handleDevFocus(debugplayery);
    }
    var debugplayerz = findChildById(pd, "dev-player-position-z");
    if (debugplayerz) {
        debugplayerz.id = "dev-player-position-z-" + id;
        debugplayerz.onchange = function() {
            setDevPlayerZ(player, this.value);
        }
        handleDevFocus(debugplayerz);
    }

    var debugplayerw = findChildById(pd, "dev-player-size-width");
    if (debugplayerw) {
        debugplayerw.id = "dev-player-size-width-" + id;
        debugplayerw.onchange = function() {
            setDevPlayerWidth(player, this.value);
        }
        handleDevFocus(debugplayerw);
    }
    var debugplayerh = findChildById(pd, "dev-player-size-height");
    if (debugplayerh) {
        debugplayerh.id = "dev-player-size-height-" + id;
        debugplayerh.onchange = function() {
            setDevPlayerHeight(player, this.value);
        }
        handleDevFocus(debugplayerh);
    }
    var debugplayerd = findChildById(pd, "dev-player-size-depth");
    if (debugplayerd) {
        debugplayerd.id = "dev-player-size-depth-" + id;
        debugplayerd.onchange = function() {
            setDevPlayerDepth(player, this.value);
        }
        handleDevFocus(debugplayerd);
    }

    var debugplayer = findChildById(pd, "dev-debug-player-player");
    if (debugplayer) {
        debugplayer.id = "dev-debug-player-player-" + id;
        debugplayer.onclick = function() {
            setDevPlayerDebugPlayer(player, this.checked);
        }
    }

    var debugcharacter = findChildById(pd, "dev-debug-player-character");
    if (debugcharacter) {
        debugcharacter.id = "dev-debug-player-character-" + id;
        debugcharacter.onclick = function() {
            setDevPlayerDebugCharacter(player, this.checked);
        }
    }

    var debugguts = findChildById(pd, "dev-debug-player-guts");
    if (debugguts) {
        debugguts.id = "dev-debug-player-guts-" + id;
        debugguts.onclick = function() {
            setDevPlayerDebugGuts(player, this.checked);
        }
    }
    
    var debugplayercollide = findChildById(pd, "dev-debug-player-collisions");
    if (debugplayercollide) {
        debugplayercollide.id = "dev-debug-player-collisions-" + id;
    }

    document.getElementById("main-content").appendChild(pd);
    
    return {
        dialog : pd,
        visible : false,
        posx : debugplayerx,
        posy : debugplayery,
        posz : debugplayerz,
        sizew : debugplayerw,
        sizeh : debugplayerh,
        sized : debugplayerd,
        collisions : debugplayercollide,
        debugplayer : debugplayer,
        debugcharacter : debugcharacter,
        debugguts : debugguts
    };
}

function updateDevPlayer(player) {
    if (!__dev) return;
    var pid = "dev-dialog-players-player-" + player.uid;
    var pd = devplayer[pid];
    if (!pd || !pd.visible) return;
    updateDevPlayerPosition(pd, player);
    updateDevPlayerSize(pd, player);
    updateDevPlayerDebug(pd, player);
    updateDevPlayerCollision(pd, player);
    updateDevPlayerCharacter(pd, player);
}


function updateDevPlayerPosition(pd, player) {
    if (!__dev) return;
    if (pd.posx && !pd.posx.hasFocus()) {
        pd.posx.value = player.controller.x;    
    }
    if (pd.posy && !pd.posy.hasFocus()) {
        pd.posy.value = player.controller.y;    
    }
    if (pd.posz && !pd.posz.hasFocus()) {
        pd.posz.value = player.controller.z;    
    }
}

function setDevPlayerX(player, x) {
    if (!__dev) return;
    x = Number(x);
    player.controller.x = x;
    player.controller.lastX = x;
}

function setDevPlayerY(player, y) {
    if (!__dev) return;
    y = Number(y);
    player.controller.y = y;
    player.controller.lastY = y;
}

function setDevPlayerZ(player, z) {
    if (!__dev) return;
    z = Number(z);
    player.controller.z = z;
    player.controller.lastZ = z;
}





function updateDevPlayerSize(pd, player) {
    if (!__dev) return;
    if (pd.sizew && !pd.sizew.hasFocus()) {
        pd.sizew.value = player.controller.width;    
    }
    if (pd.sizeh && !pd.sizeh.hasFocus()) {
        pd.sizeh.value = player.controller.height;    
    }
    if (pd.sized && !pd.sized.hasFocus()) {
        pd.sized.value = player.controller.depth;    
    }
}

function setDevPlayerWidth(player, w) {
    if (!__dev) return;
    w = Number(w);
    player.controller.width = w;
}

function setDevPlayerHeight(player, h) {
    if (!__dev) return;
    h = Number(h);
    player.controller.height = h;
}

function setDevPlayerDepth(player, d) {
    if (!__dev) return;
    d = Number(d);
    player.controller.depth = d;
}






function updateDevPlayerIndex(index) {
    
    if (!__dev) return;

}





function removeDevPlayer(player) {
    removeDevPlayerId(player.uid);
}


function removeDevPlayerId(playerid) {
    var dialog = document.getElementById("dev-dialog-players-player-" + playerid);
    if (dialog) dialog.parentNode.removeChild(dialog);
    var pid = "dev-dialog-players-player-" + playerid;
    delete devplayer[pid];   
    removeDevDialog(pid);
    removeDevPlayerCharacterId(playerid);
}




function updateDevPlayerDebug(pd, player) {
    if (!__dev) return;
    if (pd.debugplayer) {
        pd.debugplayer.checked = player.debug.player;    
    }
    if (pd.debugcharacter) {
        pd.debugcharacter.checked = player.debug.character;    
    }
    if (pd.debugguts) {
        pd.debugguts.checked = player.debug.guts;    
    }
}

function setDevPlayerDebugPlayer(player, debug) {
    if (!__dev) return;
    player.debug.player = debug;
}

function setDevPlayerDebugCharacter(player, debug) {
    if (!__dev) return;
    player.debug.character = debug;
}

function setDevPlayerDebugGuts(player, debug) {
    if (!__dev) return;
    player.debug.guts = debug;
}





function changeDevPlayerCharacter(player, char) {
    if (!__dev) return;
    controller.changePlayerCharacter(player, char);
}




function updateDevPlayerImage(player) {
    if (!__dev) return;
    updateDevPlayerCharacterImage(player);
}

