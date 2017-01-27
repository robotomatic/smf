(function(){

    var players = loadPlayers();
    var level = loadLevel();
    var views = loadViews(players);

    var game;
    game = new GameLoop(new Stage(level, players, views));
    
    game.resize();
    window.addEventListener('resize', debounce(function() { game.resize(); }, 250) );
    run();

    function run() { 
        game.run(); 
        requestAnimationFrame(run);
    }
}());