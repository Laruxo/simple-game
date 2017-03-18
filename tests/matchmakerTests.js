const assert = require('assert');
const MatchMaker = require('../components/MatchMaker');

describe('components/matchmaker.js', function() {
  let matchmaker;
  const player1 = {
    id: '1',
    response: function(response) {
      assert.deepEqual(response, {type: 'matchFound', url: '/game'});
    },
  };
  const player2 = {
    id: '2',
    response: function(response) {
      assert.deepEqual(response, {type: 'matchFound', url: '/game'});
    },
  };

  beforeEach(function() {
    matchmaker = new MatchMaker();
  });

  afterEach(function() {
    matchmaker = null;
  });

  it('should start with empty queue', function() {
    assert.deepEqual(matchmaker.queue, []);
  });

  it('should add player to queue', function() {
    matchmaker.addToQueue(player1);
    assert.deepEqual(matchmaker.queue, [player1]);
  });

  it('should remove player from queue', function() {
    matchmaker.addToQueue(player1);
    matchmaker.removeFromQueue('1');
    assert.deepEqual(matchmaker.queue, []);
  });

  it('should match 2 people who are searching for game', function() {
    matchmaker.addToQueue(player1);
    matchmaker.addToQueue(player2);
    assert.deepEqual(matchmaker.queue, []);
  });
});
