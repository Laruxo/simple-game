const events = require('events');

/**
 * MatchMaker class that holds matchmaking queue and matches players
 */
class MatchMaker {
  /**
   * @constructor
   */
  constructor() {
    this.queue = [];
    this.averageWait = null;

    this.queueEmmiter = new events.EventEmitter();
    this.queueEmmiter.on('newPlayer', this._findMatch.bind(this));
  }

  /**
   * Returns formated average wait time in queue
   * @return {string}
   */
  getAverageWait() {
    if (this.averageWait) {
      const time = new Date(this.averageWait);
      return time.getMinutes().toString(10) + ':' + time.getSeconds().toString(10);
    }

    return 'N/A';
  }

  /**
   * Adds player to queue
   * @param {Object} player
   * @param {string} player.id
   * @param {Function} player.response
   * @param {Number} [player.enterTime]
   */
  addToQueue(player) {
    if (player.hasOwnProperty('id') && player.hasOwnProperty('response')) {
      player.enterTime = Date.now();
      this.queue.push(player);
      this.queueEmmiter.emit('newPlayer');
    }
  }

  /**
   * Removes player from queue by his id
   * @param {string} playerId
   */
  removeFromQueue(playerId) {
    const nr = this._findPlayer(playerId);
    if (nr !== null) {
      this.queue.splice(nr, 1);
    }
  }

  /**
   * Finds player in queue
   * @param {string} playerId
   * @return {Number|null}
   * @private
   */
  _findPlayer(playerId) {
    for (let nr = 0; nr < this.queue.length; nr++) {
      if (this.queue[nr].id === playerId) {
        return nr;
      }
    }

    return null;
  }

  /**
   * Find a match if there are enough player in queue
   * @private
   */
  _findMatch() {
    if (this.queue.length > 1) {
      const playerA = this.queue.shift();
      const playerB = this.queue.shift();
      this.averageWait = MatchMaker.calculateNewWait(
        this.averageWait,
        playerA.enterTime,
        playerB.enterTime
      );
      MatchMaker.newMatch(playerA.response, playerB.response);
    }
  }

  /**
   * Updates average wait time with given enter times of 2 player
   * @param {Number} average
   * @param {Number} waitA
   * @param {Number} waitB
   * @return {Number}
   */
  static calculateNewWait(average, waitA, waitB) {
    const time = Date.now();
    const avg = ((time - waitA) + (time - waitB)) / 2;
    if (average) {
      return (average + avg) / 2;
    }

    return avg;
  }

  /**
   * Starts a new match
   * @param {Function} playerA
   * @param {Function} playerB
   */
  static newMatch(playerA, playerB) {
    const game = {
      type: 'matchFound',
      url: '/game',
    };
    playerA(game);
    playerB(game);
  }
}

module.exports = MatchMaker;
