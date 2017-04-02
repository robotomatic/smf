"use strict";

function GameSettings() {
    
    this.settings = {
        camera : {
            follow : false,
            view : "loose"
        },
        debug : {
            level : {
                level : false,
                hsr : false,
                render : false
            },
            player : {
                player : false,
                character : false,
                guts : false
            },
            collision : {
                level : false,
                players : false
            }
        },
        levelname : "",
        character : "",
        players : 1
    };
    this.key = "super.murder.friends.info";
}

GameSettings.prototype.load = function() {
    var settings = localStorage.getItem(this.key);
    if (settings) {
        var parsed = JSON.parse(settings);
        for (var key in parsed) {
            this.settings[key]  = parsed[key];
        }
    }
}

GameSettings.prototype.save = function() {
    localStorage.setItem(this.key, JSON.stringify(this.settings));
}