"use strict";

var dev_view_render_world = null;
var dev_view_render_players = null;
var dev_view_render_items = null;
var dev_view_render_particles = null;

function initializeDevViewRender() {
    if (!__dev) return;
    dev_view_render_world = document.getElementById("dev-view-render-world");
    dev_view_render_world.onclick = function() {
        toggleDevViewRenderWorld();
    }
    dev_view_render_players = document.getElementById("dev-view-render-players");
    dev_view_render_players.onclick = function() {
        toggleDevViewRenderPlayers();
    }
    dev_view_render_items = document.getElementById("dev-view-render-items");
    dev_view_render_items.onclick = function() {
        toggleDevViewRenderItems();
    }
    dev_view_render_particles = document.getElementById("dev-view-render-particles");
    dev_view_render_particles.onclick = function() {
        toggleDevViewRenderParticles();
    }
}

function resetDevViewRender(world) {
    if (!world) return;
    updateDevViewRender();
}
function updateDevViewRender() {
    if (!__dev) return;
    updateDevViewRenderWorld();
    updateDevViewRenderPlayers();
    updateDevViewRenderItems();
    updateDevViewRenderParticles();
}

function toggleDevViewRenderWorld() {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var render = dev_view_render_world.checked;
    gamecontroller.game.loop.gameworld.world.worldrenderer.render.world = render;
    updateDevViewRenderWorld();
}

function updateDevViewRenderWorld() {
    if (!__dev) return;
    var render = gamecontroller.game.loop.gameworld.world.worldrenderer.render.world;
    dev_view_render_world.checked = render;
}

function toggleDevViewRenderPlayers() {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var render = dev_view_render_players.checked;
    gamecontroller.game.loop.gameworld.world.worldrenderer.render.players = render;
    updateDevViewRenderPlayers();
}

function updateDevViewRenderPlayers() {
    if (!__dev) return;
    var render = gamecontroller.game.loop.gameworld.world.worldrenderer.render.players;
    dev_view_render_players.checked = render;
}

function toggleDevViewRenderItems() {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var render = dev_view_render_items.checked;
    gamecontroller.game.loop.gameworld.world.worldrenderer.render.items = render;
    updateDevViewRenderItems();
}

function updateDevViewRenderItems() {
    if (!__dev) return;
    var render = gamecontroller.game.loop.gameworld.world.worldrenderer.render.items;
    dev_view_render_items.checked = render;
}

function toggleDevViewRenderParticles() {
    if (!__dev) return;
    if (!gamecontroller || !gamecontroller.game) return;
    var render = dev_view_render_particles.checked;
    gamecontroller.game.loop.gameworld.world.worldrenderer.render.particles = render;
    updateDevViewRenderParticles();
}

function updateDevViewRenderParticles() {
    if (!__dev) return;
    var render = gamecontroller.game.loop.gameworld.world.worldrenderer.render.particles;
    dev_view_render_particles.checked = render;
}
