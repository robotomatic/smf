"use strict";

function GameLoader() {
    this.callback;
    this.levels;
    this.level;
    this.themes;
    this.players;
    this.characters;
    this.animations;
    this.ui;
    this.devtools;
}

GameLoader.prototype.reset = function() {
    this.callback = null;
    this.levels = null;
    this.level = null;
    this.themes = null;
    this.players = null;
    this.characters = null;
    this.animations = null;
    this.ui = null;
    this.devtools = null;
}

GameLoader.prototype.loadMenu = function(levelfile, charfile, animfile, callback) {
    this.reset();
    this.callback = callback;
    var loader = this;
    var testComplete = function() {
        if (loader.level && loader.characters && loader.characters.loaded && loader.animations && loader.animations.loaded) {
            if (loader.callback) loader.callback();
            loader.callback = null;
            return false;
        }
    }
    this.loadLevelFile(levelfile, testComplete);
    this.loadCharactersFile(charfile, testComplete);
    this.loadAnimationsFile(animfile, testComplete);
}

GameLoader.prototype.loadMenuPlayerChooser = function(levelfile, charfile, animfile, uifile, callback) {
    this.reset();
    this.callback = callback;
    var loader = this;
    var testComplete = function() {
        if (loader.level && loader.characters && loader.characters.loaded && loader.animations && loader.animations.loaded && loader.ui) {
            if (loader.callback) loader.callback();
            loader.callback = null;
            return false;
        }
    }
    this.loadLevelFile(levelfile, testComplete);
    this.loadCharactersFile(charfile, testComplete);
    this.loadAnimationsFile(animfile, testComplete);
    this.loadUIFile(uifile, testComplete);
}

GameLoader.prototype.loadMenuLevelChooser = function(levelsfile, themesfile, uifile, callback) {
    this.reset();
    this.callback = callback;
    var loader = this;
    var testComplete = function() {
        if (loader.levels && loader.themes && loader.themes.loaded && loader.ui) {
            if (loader.callback) loader.callback();
            return false;
        }
    }
    this.loadLevelsFile(levelsfile, testComplete);
    this.loadThemesFile(themesfile, testComplete);
    this.loadUIFile(uifile, testComplete);
}

GameLoader.prototype.loadGameParty = function(levelsfile, themesfile, charfile, animfile, callback) {
    this.reset();
    this.callback = callback;
    var loader = this;
    var testComplete = function() {
        if (loader.levels && loader.themes && loader.themes.loaded && loader.characters && loader.characters.loaded && loader.animations && loader.animations.loaded) {
            if (loader.callback) loader.callback();
            return false;
        }
    }
    this.loadLevelsFile(levelsfile, testComplete);
    this.loadThemesFile(themesfile, testComplete);
    this.loadCharactersFile(charfile, testComplete);
    this.loadAnimationsFile(animfile, testComplete);
}








GameLoader.prototype.loadLevelsFile = function(file, callback) {
    var loader = this;
    loadJSON(file, function(data){
        loader.loadLevels(data, callback);
    }, function(data) {
        showError(data)
    });
}

GameLoader.prototype.loadLevels = function(data, callback) {
    this.levels = new Levels().loadJson(data);
    if (callback) callback();
}

GameLoader.prototype.loadLevelFile = function(file, callback) {
    var loader = this;
    loadJSON(file, function(data){
        loader.loadLevel(data, callback);
    }, function(data) {
        showError(data)
    });
}




GameLoader.prototype.loadLevel = function(data, callback) {
    this.level = new Level().loadJson(data);
    if (callback) callback();
}




GameLoader.prototype.loadUIFile = function(file, callback) {
    var loader = this;
    loadAJAX(file, function(data){
        loader.loadUI(data, callback);
    }, function(data) {
        showError(data)
    });
}

GameLoader.prototype.loadUI = function(data, callback) {
    this.ui = data;
    if (callback) callback();
}

GameLoader.prototype.loadDevToolsFile = function(file, callback) {
    var loader = this;
    loadAJAX(file, function(data){
        loader.loadDevTools(data, callback);
    }, function(data) {
        showError(data)
    });
}

GameLoader.prototype.loadDevTools = function(data, callback) {
    this.devtools = data;
    if (callback) callback();
}






GameLoader.prototype.loadThemesFile = function(file, callback) {
    var loader = this;
    loadJSON(file, function(data) {
        loader.loadThemes(data, callback);
    }, function(data) {
        showError(data)
    });
}

GameLoader.prototype.loadThemes = function(data, callback) {
    var loader = this;
    this.themes = new Themes();
    var keys = Object.keys(data);
    var total = keys.length;
    for (var i = 0; i < total; i++) {
        var file = data[keys[i]].file;
        loadJSON(file, function(data) {
            loader.loadTheme(data, total, callback);
        }, function(data) {
            showError(data)
        });
    }
}

GameLoader.prototype.loadTheme = function(data, total, callback) {
    var keys = Object.keys(data);
    var name = keys[0];
    this.themes.themes[name] = new Theme(name).loadJson(data[name]);
    var tkeys = Object.keys(this.themes.themes);
    if (tkeys.length == total) {
        this.themes.loaded = true;
        if (callback) callback();        
    }
}







GameLoader.prototype.loadCharactersFile = function(file, callback) {
    var loader = this;
    loadJSON(file, function(data){
        loader.loadCharacters(data, callback);
    }, function(data) {
        showError(data)
    });
}

GameLoader.prototype.loadCharacters = function(data, callback) {
    var loader = this;
    this.characters = new Characters();
    var keys = Object.keys(data);
    var total = keys.length;
    for (var i = 0; i < total; i++) {
        var file = data[keys[i]].file;
        loadJSON(file, function(data) {
            loader.loadCharacter(data, total, callback);
        }, function(data) {
            showError(data)
        });
    }
}

GameLoader.prototype.loadCharacter = function(data, total, callback) {
    var keys = Object.keys(data);
    var name = keys[0];
    this.characters.characters[name] = new Character().loadJson(data[name]);
    var tkeys = Object.keys(this.characters.characters);
    if (tkeys.length == total) {
        this.characters.loaded = true;
        if (callback) callback();        
    }
}




GameLoader.prototype.loadAnimationsFile = function(file, callback) {
    var loader = this;
    loadJSON(file, function(data){
        loader.loadAnimations(data, callback);
    }, function(data) {
        showError(data)
    });
}

GameLoader.prototype.loadAnimations = function(data, callback) {
    var loader = this;
    this.animations = new Animations();
    var keys = Object.keys(data);
    var total = keys.length;
    for (var i = 0; i < total; i++) {
        var file = data[keys[i]].file;
        loadJSON(file, function(data) {
            loader.loadAnimation(data, total, callback);
        }, function(data) {
            showError(data)
        });
    }
}

GameLoader.prototype.loadAnimation = function(data, total, callback) {
    var keys = Object.keys(data);
    var name = keys[0];
    this.animations.animations[name] = {};
    for (var a in data[name]) this.animations.animations[name][a] = new Animation().loadJson(data[name][a]);
    var tkeys = Object.keys(this.animations.animations);
    if (tkeys.length == total) {
        this.animations.loaded = true;
        if (callback) callback();        
    }
}



