const assert = require('assert');
const matchmaker = require('../components/MatchMaker');

describe('components/matchmaker.js', function() {
  const player1 = {
    id: '1',
    callback: function(response) {
      assert.deepEqual(response, {type: 'matchFound', url: '/game'});
    },
  };

  const player2 = {
    id: '2',
    callback: function(response) {
      assert.deepEqual(response, {type: 'matchFound', url: '/game'});
    },
  };

  it('should start with empty queue', function() {
    assert.deepEqual(matchmaker.queue, []);
  });

  it('should add player to queue', function() {
    matchmaker.addToQueue(player1.id, player1.callback);
    assert.equal(matchmaker.queue.length, 1);
  });

  it('should remove player from queue', function() {
    matchmaker.removeFromQueue(player1.id);
    assert.deepEqual(matchmaker.queue, []);
  });

  it('should match 2 people who are searching for game', function() {
    matchmaker.addToQueue(player1.id, player1.callback);
    setTimeout(() => {
      matchmaker.addToQueue(player2.id, player2.callback);
      assert.deepEqual(matchmaker.queue, []);
    }, 2000);
  });

  it('should format calculated average wait time after matching players', function() {
    assert(matchmaker.getAverageWait(), '00:01');
  });
});
