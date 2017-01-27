function GameLoader() {
    this.callback;
    this.level;
    this.items;
    this.players;
    this.characters;
    this.animations;
    this.ui;
    this.devtools;
}

GameLoader.prototype.reset = function() {
    this.callback = null;
    this.level = null;
    this.items = null;
    this.players = null;
    this.characters = null;
    this.animations = null;
    this.devtools = null;
}

GameLoader.prototype.loadMenuPlayer = function(levelfile, charfile, animfile, devtoolsfile, callback) {
    this.reset();
    this.callback = callback;
    var loader = this;
    var testComplete = function() {
        if (loader.level && loader.characters && loader.animations && loader.devtools) {
            if (loader.callback) loader.callback();
            return false;
        }
    }
    this.loadLevelFile(levelfile, testComplete);
    this.loadCharactersFile(charfile, testComplete);
    this.loadAnimationsFile(animfile, testComplete);
    this.loadDevToolsFile(devtoolsfile, testComplete);
}

GameLoader.prototype.loadMenuPlayerChooser = function(levelfile, charfile, animfile, uifile, devtoolsfile, callback) {
    this.reset();
    this.callback = callback;
    var loader = this;
    var testComplete = function() {
        if (loader.level && loader.characters && loader.animations && loader.ui && loader.devtools) {
            if (loader.callback) loader.callback();
            return false;
        }
    }
    this.loadLevelFile(levelfile, testComplete);
    this.loadCharactersFile(charfile, testComplete);
    this.loadAnimationsFile(animfile, testComplete);
    this.loadUIFile(uifile, testComplete);
    this.loadDevToolsFile(devtoolsfile, testComplete);
}

GameLoader.prototype.loadMenuPlayerLevel = function(levelsfile, itemsfile, devtoolsfile, callback) {
    this.reset();
    this.callback = callback;
    var loader = this;
    var testComplete = function() {
        if (loader.level && loader.items && loader.devtools) {
            if (loader.callback) loader.callback();
            return false;
        }
    }
    this.loadLevelFile(levelsfile, testComplete);
    this.loadItemsFile(itemsfile, testComplete);
    this.loadDevToolsFile(devtoolsfile, testComplete);
}

GameLoader.prototype.loadGamePlayer = function(levelfile, itemsfile, playersfile, charfile, animfile, devtoolsfile, callback) {
    this.reset();
    this.callback = callback;
    var loader = this;
    var testComplete = function() {
        if (loader.level && loader.items && loader.players && loader.characters && loader.animations && loader.devtools) {
            if (loader.callback) loader.callback();
            return false;
        }
    }
    this.loadLevelFile(levelfile, testComplete);
    this.loadItemsFile(itemsfile, testComplete);
    this.loadPlayersFile(playersfile, testComplete);
    this.loadCharactersFile(charfile, testComplete);
    this.loadAnimationsFile(animfile, testComplete);
    this.loadDevToolsFile(devtoolsfile, testComplete);
}

GameLoader.prototype.loadMenuParty = function(levelfile, charfile, animfile, devtoolsfile, callback) {
    this.reset();
    this.callback = callback;
    var loader = this;
    var testComplete = function() {
        if (loader.level && loader.characters && loader.animations && loader.devtools) {
            if (loader.callback) loader.callback();
            return false;
        }
    }
    this.loadLevelFile(levelfile, testComplete);
    this.loadCharactersFile(charfile, testComplete);
    this.loadAnimationsFile(animfile, testComplete);
    this.loadDevToolsFile(devtoolsfile, testComplete);
}

GameLoader.prototype.loadGameParty = function(levelfile, itemsfile, playersfile, charfile, animfile, devtoolsfile, callback) {
    this.reset();
    this.callback = callback;
    var loader = this;
    var testComplete = function() {
        if (loader.level && loader.items && loader.players && loader.characters && loader.animations && loader.devtools) {
            if (loader.callback) loader.callback();
            return false;
        }
    }
    this.loadLevelFile(levelfile, testComplete);
    this.loadItemsFile(itemsfile, testComplete);
    this.loadPlayersFile(playersfile, testComplete);
    this.loadCharactersFile(charfile, testComplete);
    this.loadAnimationsFile(animfile, testComplete);
    this.loadDevToolsFile(devtoolsfile, testComplete);
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

GameLoader.prototype.loadItemsFile = function(file, callback) {
    var loader = this;
    loadJSON(file, function(data) {
        loader.loadItems(data, callback);
    }, function(data) {
        showError(data)
    });
}

GameLoader.prototype.loadItems = function(data, callback) {
    this.items = new ItemRenderer(data);
    if (callback) callback();
}

GameLoader.prototype.loadPlayersFile = function(file, callback) {
    var loader = this;
    loadJSON(file, function(data){
        loader.loadPlayers(data, callback);
    }, function(data) {
        showError(data)
    });
}

GameLoader.prototype.loadPlayers = function(data, callback) {
    this.players = new Players().loadJson(data);
    if (callback) callback();
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
    this.characters = new Characters().loadJson(data);
    if (callback) callback();
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
    this.animations = new Animations().loadJson(data); 
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