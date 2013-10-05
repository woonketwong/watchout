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
  createEnemies = function() {
    return _.range(0, gameOptions.nEnemies).map(function(i) {
      return {
        id: i,
        x: parseFloat(Math.random() * 100,10),
        y: parseFloat(Math.random() * 100,10)
      };
    });
  };
  // var createEnemies = function(){
  //    var value =  _.map(_.range(0, gameOptions.nEnemies), function(value, key, list){
  //      return {id:value, x: Math.random()*100, y: Math.random()*100};
  //    // return _.map(_.range(0, gameOptions.nEnemies), function(value, key, list){
  //    //   return {id:value, x: Math.random()*100, y: Math.random()*100};
  //   // return _.range(0, gameOptions.nEnemies).map(function(i) {
  //   //   return {
  //   //     id: i,
  //   //     x: Math.random() * 100,
  //   //     y: Math.random() * 100
  //   //   };
  //   });
  //   console.log (value);
  //   return value;
  // };
  var render = function(enemy_data){
    var enemies = gameBoard.selectAll('circle.enemy').data(enemy_data, function(d){return d.id;});
    // var enemies = gameBoard.selectAll('circle.enemy').data(enemy_data, function(d){return d.id;});

    enemies.enter().append('svg:circle')
      .attr('class','enemy')
      .attr('cx', function(enemy){
        
        return axes.x(enemy.x);
      })
      .attr('cy', function(enemy){
        return axes.y(enemy.y);
      })
      .attr('r', 10);

    // console.log('after enter ',enemies);

    enemies.exit().remove();

    var tweenMove = function(endData){
      // console.log(endData)
      var enemy = d3.select(this);
      console.log(enemy)
      var startPos = {
        x: parseFloat(enemy.attr('cx')),
        y: parseFloat(enemy.attr('cy'))
      };

      var endPos = {
        x: axes.x(endData.x),
        y: axes.y(endData.y)
      };
      console.log(endPos)

      return function(t) {
        // check collision
        var enemyNextPos = {
          x: parseFloat(startPos.x + (endPos.x - startPos.x) * t, 10),
          y: parseFloat(startPos.y + (endPos.y - startPos.y) * t, 10)
        };
        // console.log(enemyNextPos);
    
        return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
      };
    };
    // debugger;
    return gameBoard.selectAll('circle.enemy').transition().duration(1000).tween('custom', tweenMove);
    // console.log(enemies);
    // return enemies.transition().duration(1000).tween('custom', tweenMove);
    // return gameBoard.selectAll('circle.enemy');
  };

  
  


  var play = function(){
    var gameTurn = function(){
      var newEnemyPositions = createEnemies();
      // console.log(newEnemyPositions);
      render(newEnemyPositions);
    }
    var newEnemyPositions = createEnemies();
    gameTurn(newEnemyPositions);
    setInterval(gameTurn,1000);

  };
  // debugger;
  play();


}).call(this);

