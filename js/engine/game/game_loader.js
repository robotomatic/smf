"use strict";

function GameLoader() {
    this.callback;

    this.levels;
    this.levelkeys;
    this.level;
    
    this.themes;
    this.materials;
    this.players;
    this.characters;
    this.animations;
    
    this.ui;
    this.dev;
}

GameLoader.prototype.reset = function() {
    this.callback = null;
    this.levels = null;
    this.levelkeys = null;
    this.level = null;
    this.themes = null;
    this.players = null;
    this.characters = null;
    this.animations = null;
    this.ui = null;
}

GameLoader.prototype.loadDev = function(file, callback) {
    var loader = this;
    loadAJAX(file, function(data){
        loader.dev = data;
        if (callback) callback();
    }, function(data) {
        showError(data)
    });
}

GameLoader.prototype.loadMenu = function(levelfile, charfile, animfile, callback) {
    benchmark("menu load - start", "load");
    this.reset();
    this.callback = callback;
    var loader = this;
    var testComplete = function() {
        if (loader.level && loader.characters && loader.characters.loaded && loader.animations && loader.animations.loaded) {
            benchmark("menu load - end", "load");
            if (loader.callback) loader.callback();
            loader.callback = null;
            return false;
        }
    }
    this.loadLevelFile(levelfile, testComplete);
    this.loadCharactersFile(charfile, testComplete);
    this.loadAnimationsFile(animfile, testComplete);
}

GameLoader.prototype.loadGameParty = function(levelsfile, themesfile, materialsfile, charfile, animfile, callback) {
    benchmark("game load - start", "load");
    this.reset();
    this.callback = callback;
    var loader = this;
    var testComplete = function() {
        if (loader.levels && loader.themes && loader.themes.loaded && loader.materials && loader.materials.loaded && loader.characters && loader.characters.loaded && loader.animations && loader.animations.loaded) {
            benchmark("game load - end", "load");
            if (loader.callback) loader.callback();
            return false;
        }
    }
    this.loadLevelsFile(levelsfile, testComplete);
    this.loadThemesFile(themesfile, testComplete);
    this.loadMaterialsFile(materialsfile, testComplete);
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
    this.levelkeys = Object.keys(this.levels);
    benchmark("levels loaded");
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
    var loader = this;
    var keys = Object.keys(data.layers);
    var total = keys.length;

    this.level = new Level().loadJson(data);
    
    if (!total) return;

    if (!data.layers[keys[0]].file) {
        this.level.loadLayers(data.layers);
        if (callback) callback();
        return;
    }

    var totlayers = total;
    
    for (var i = 0; i < total; i++) {
        var draw = data.layers[keys[i]].draw;
        if (draw === false) {
            if (i == total - 1) {
                this.level.layersLoaded();
                if (callback) callback();        
            }
            continue;
        }
        var file = data.layers[keys[i]].file;
        loadJSON(file, function(data) {
            loader.loadLayer(data, totlayers, callback);
        }, function(data) {
            showError(data)
        });
    }
}








GameLoader.prototype.loadLayer = function(data, total, callback) {
    var t = data.length;
    for (var i = 0; i < t; i ++) {
        var layer = new Layer().loadJson(data[i]);
        this.level.layers.push(layer);    
    }
    if (++this.level.loadedfiles == total) {
        this.level.layersLoaded();
        if (callback) callback();        
    }
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
    this.themes.addTheme(new Theme(name).loadJson(data[name]));
    var t = this.themes.themes.length;
    if (t == total) {
        this.themes.loaded = true;
        benchmark("themes loaded");
        if (callback) callback();        
    }
}













GameLoader.prototype.loadMaterialsFile = function(file, callback) {
    var loader = this;
    loadJSON(file, function(data) {
        loader.loadMaterials(data, callback);
    }, function(data) {
        showError(data)
    });
}

GameLoader.prototype.loadMaterials = function(data, callback) {
    var loader = this;
    this.materials = new Materials();
    var keys = Object.keys(data);
    var total = keys.length;
    for (var i = 0; i < total; i++) {
        var file = data[keys[i]].file;
        loadJSON(file, function(data) {
            loader.loadMaterial(data, total, callback);
        }, function(data) {
            showError(data)
        });
    }
}

GameLoader.prototype.loadMaterial = function(data, total, callback) {
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        var name = keys[i];
        this.materials.materials[name] = new Material(name).loadJson(data[name]);
    }
    this.materials.loaded++;
    if (this.materials.loaded == total) {
        benchmark("materials loaded");
        this.materials.loaded = true;
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
        loadJSON(file, function(data, index) {
            loader.loadCharacter(data, index, total, callback);
        }, function(data) {
            showError(data)
        }, i);
    }
}

GameLoader.prototype.loadCharacter = function(data, index, total, callback) {
    var keys = Object.keys(data);
    var name = keys[0];
    
    var c = new Character().loadJson(data[name]);
    c.id = index;
    this.characters.characters[name] = c;
    
    var tkeys = Object.keys(this.characters.characters);
    if (tkeys.length == total) {
        this.characters.characters = sortObject(this.characters.characters, sortById);
        benchmark("characters loaded");
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
    this.animations = new CharacterAnimations();
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
    for (var a in data[name]) {
        this.animations.animations[name][a] = new CharacterAnimation().loadJson(data[name][a]);
    }
    var tkeys = Object.keys(this.animations.animations);
    if (tkeys.length == total) {
        this.animations.loaded = true;
        benchmark("animations loaded");
        if (callback) callback();        
    }
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





