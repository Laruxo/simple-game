const assert = require('assert');
const manager = require('../components/GamesManager');

describe.only('components/matchmaker.js', function() {
  const player = {ready: false, callback: null, result: null};

  it('should start with empty games array and players object', function() {
    assert.deepEqual(manager.games, []);
    assert.deepEqual(manager.players, {});
  });

  it('should create a new game and store players, given two players', function() {
    manager.createGame('1', '2');
    assert.deepEqual(manager.games, [{playerA: '1', playerB: '2', ready: 0, started: false}]);
    assert.deepEqual(manager.players, {'1': player, '2': player});
  });

  it('should start a game only when both players are ready', function() {
    manager.playerReady('1', () => {});
    assert.equal(manager.games[0].started, false);
    manager.playerReady('2', () => {});
    assert.equal(manager.games[0].started, true);
  });

  it('should make the player who presses the button first the winner', function() {
    manager.resolveGame('1', true);
    assert.equal(manager.players['1'].result, true);
    assert.equal(manager.players['2'].result, null);
  });

  it('should return readable last game results', function() {
    assert.equal(manager.getLastResult('1'), 'You WON!');
    assert.equal(manager.getLastResult('2'), 'You LOST...');
    assert.equal(manager.getLastResult('3'), 'No previous games.');
  });
});
