(function(){
  var gameOptions = {
    height: 450,
    width: 700,
    nEnemies: 20,
    padding: 20
  };

  var gameStats = {
    score: 0,
    bestScore: 0
  };

  var axes = {
    x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
    y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
  };

  var gameBoard = d3.select('.container').append('svg:svg').attr('width', gameOptions.width).attr('height', gameOptions.height);

  var updateScore = function(){
    d3.select('#current-score').text(gameStats.score.toString());
  };

  var updateBestScore = function(){
    gameStats.bestScore = _.max([gameStats.score, gameStats.bestScore]);
    d3.select('#best-score').text(gameStats.bestScore.toString());
  };
  var createEnemies = function() {
    return _.range(0, gameOptions.nEnemies).map(function(i) {
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      };
    });
  };

  // var player = gameBoard.select('circle.player').data([gameOptions.width/2, gameOptions.height/2]);
  var player = gameBoard.append('svg:circle').attr('cx', 200).attr('cy', 200).attr('r', 10).attr('fill', 'red').call(d3.behavior.drag().on('drag', move));
  
  function move() {
    var dragTarget = d3.select(this);
    d3.select(this)
      .attr('cx', function() { return d3.event.dx + parseInt(d3.select(this).attr('cx'))})
      .attr('cy', function() { return d3.event.dy + parseInt(d3.select(this).attr('cy'))})
  };

  var render = function(enemy_data){
    var enemies = gameBoard.selectAll('circle.enemy').data(enemy_data, function(d){ return d.id; });

    enemies.enter().append('svg:circle')
      .attr('class','enemy')
      .attr('cx', function(enemy){
        return axes.x(enemy.x);
      })
      .attr('cy', function(enemy){
        return axes.y(enemy.y);
      })
      .attr('r', 10);

    enemies.exit().remove();

    var tweenMove = function(endData){
      var enemy = d3.select(this);
      var startPos = {
        x: parseFloat(enemy.attr('cx')),
        y: parseFloat(enemy.attr('cy'))
      };

      var endPos = {
        x: axes.x(endData.x),
        y: axes.y(endData.y)
      };

      return function(t) {
        var enemyNextPos = {
          x: startPos.x + (endPos.x - startPos.x) * t,
          y: startPos.y + (endPos.y - startPos.y) * t
        };
        return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
      };
    };
    return gameBoard.selectAll('circle.enemy').transition().duration(1000).tween('custom', tweenMove);
  };

  var play = function(){
    var gameTurn = function(){
      var newEnemyPositions = createEnemies();
      render(newEnemyPositions);
    };

    gameTurn();
    setInterval(gameTurn,1000);
  };
  play();

}).call(this);