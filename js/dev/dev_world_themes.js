"use strict"

var dev_world_themes_theme_template = null;
var dev_world_themes_theme_list = null;

function initializeDevWorldThemes() {
    dev_world_themes_theme_template = document.getElementById("dev-dialog-world-themes-theme-template");
    dev_world_themes_theme_list = document.getElementById("dev-dialog-world-themes");
}



function updateDevWorldThemes(world) {
    if (!__dev) return;
    removeDevWorldThemes();
    var themes = controller.gameloader.themes;
    if (!themes) return;
    for (var i = 0; i < themes.themes.length; i++) {
        var theme = themes.getTheme(i);
        addDevWorldTheme(world, theme);
    }
}

function removeDevWorldThemes() {
    var temp = dev_world_themes_theme_template.cloneNode(true);
    dev_world_themes_theme_list.innerHTML = "";
    dev_world_themes_theme_list.appendChild(temp);
}


function addDevWorldTheme(world, theme) {

    var template = dev_world_themes_theme_template;
    if (!template) return;

    var themename = theme.name;
    var themeid = themename.replace(" ", "-");
    
    var item = template.cloneNode(true);
    item.id = "dev-dialog-world-themes-theme-" + themeid;
    item.style.display = "block";
    item.className += " dialog-row-world-theme";

    var tname = item.children.item(1);
    tname.id = "dev-dialog-world-themes-theme-name-" + themeid;
    tname.innerHTML = themename;
    
    var tcheck = item.children.item(1);
    tname.id = "dev-dialog-world-themes-theme-name-" + themeid;
    tname.innerHTML = themename;
    
    var tactive = item.children.item(2);
    tactive.id = "dev-dialog-world-themes-theme-active-" + themeid;
    var tactivelabel = tactive.children.item(0);
    var tactivelabelactive = tactivelabel.children.item(0);
    tactivelabelactive.id = "dev-dialog-world-themes-theme-active-active-" + themeid;
    
    var checked = false;
    var worldthemes = world.worldrenderer.itemrenderer.themes;
    for (var i = 0; i < worldthemes.length; i++) {
        var worldtheme = worldthemes[i];
        if (worldtheme.name == themename) {
            checked = true;
            break;
        }
    }
    tactivelabelactive.checked = checked;
    var index = document.getElementsByClassName("dev-dialog-world-themes-theme").length - 1;
    tactivelabelactive.index = index;
    
    tactivelabelactive.onchange = function() {
        var theme = this.id.replace("dev-dialog-world-themes-theme-active-active-", "");
        var check = this.checked;
        var index = this.index;
        updateDevWorldThemesTheme(theme, index, check);
    };
    
    dev_world_themes_theme_list.appendChild(item);
}



function updateDevWorldThemesTheme(theme, index, active) {
    controller.changeWorldTheme(theme, index, active);
}

