const manager = require('./GamesManager');

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
  }

  /**
   * Returns formatted average wait time in queue
   * @return {string}
   */
  getAverageWait() {
    if (this.averageWait) {
      const time = new Date(this.averageWait);
      const min = time.getMinutes();
      const sec = time.getSeconds();

      let wait = '';
      if (min < 10) {
        wait += '0';
      }
      wait += min.toString(10);

      wait += ':';

      if (sec < 10) {
        wait += '0';
      }
      wait += sec.toString(10);

      return wait;
    }

    return 'N/A';
  }

  /**
   * Adds player to queue, calls callback when match is found
   * @param {string} playerId
   * @param {Function} callback
   */
  addToQueue(playerId, callback) {
    // TODO: could be a class
    const player = {
      id: playerId,
      enterTime: Date.now(),
      callback: callback,
    };

    this.queue.push(player);
    this._findMatch();
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
   * Starts a new match
   * @param {Object} playerA
   * @param {Object} playerB
   */
  newMatch(playerA, playerB) {
    this.averageWait = MatchMaker.calculateNewWait(
      this.averageWait,
      playerA.enterTime,
      playerB.enterTime
    );

    const response = {
      type: 'matchFound',
      url: '/game',
    };
    playerA.callback(response);
    playerB.callback(response);

    manager.createGame(playerA.id, playerB.id);
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
      this.newMatch(playerA, playerB);
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
}

module.exports = new MatchMaker();
