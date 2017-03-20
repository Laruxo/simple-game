/**
 * Class for managing games
 */
class GamesManager {
  /**
   * @constructor
   */
  constructor() {
    this.players = {};
    this.games = [];
  }

  /**
   * Checks is given id belongs to existing player
   * @param {string} playerId
   * @return {boolean}
   */
  isPlayer(playerId) {
    return this.players.hasOwnProperty(playerId);
  }

  /**
   * Gets given player last game results if he has them.
   * @param {string} playerId
   * @return {string}
   */
  getLastResult(playerId) {
    if (this.players.hasOwnProperty(playerId)) {
      if (this.players[playerId].result) {
        return 'You WON!';
      }

      return 'You LOST...';
    }

    return 'No previous games.';
  }

  /**
   * Creates game given two players ids
   * @param {string} playerA
   * @param {string} playerB
   */
  createGame(playerA, playerB) {
    this.players[playerA] = {ready: false, callback: null, result: null};
    this.players[playerB] = {ready: false, callback: null, result: null};

    // TODO: should be a class
    const game = {playerA: playerA, playerB: playerB, ready: 0, started: false};
    this.games.push(game);
  }

  /**
   * Marks player as ready to play
   * @param {string} playerId
   * @param {Function} callback
   */
  playerReady(playerId, callback) {
    const gameId = this._findGame(playerId);
    if (gameId !== null) {
      this.games[gameId].ready++;
      this.players[playerId].ready = true;

      this.players[playerId].callback = callback;
      if (this.games[gameId].ready === 2) {
        this._startGame(gameId);
      }
    }
  }

  /**
   * Resolves game when given player and condition.
   * If condition is true - player wins, else - loses.
   * @param {string} playerId
   * @param {Boolean} condition
   */
  resolveGame(playerId, condition) {
    const gameId = this._findGame(playerId);
    if (gameId !== null && this.games[gameId].started) {
      const opponent = this._getOpponent(gameId, playerId);

      if (condition) {
        this.endGame(gameId, playerId, opponent);
      } else {
        this.endGame(gameId, opponent, playerId);
      }
    }
  }

  /**
   * Ends given game with given winner and loser. When winner is null, both lose.
   * @param {string} gameId
   * @param {string|null} winner
   * @param {string|null} loser
   */
  endGame(gameId, winner, loser) {
    const game = this.games[gameId];
    clearTimeout(game.timeout);

    const response = {
      type: 'gameEnded',
      url: '/results',
    };

    if (winner === null) {
      this.players[game.playerA].callback(response);
      this.players[game.playerB].callback(response);
    } else {
      this.players[winner].result = 1;
      this.players[winner].callback(response);
      this.players[loser].callback(response);
    }

    this.games.splice(gameId, 1);
  }

  /**
   * Finds game by player id
   * @param {string} playerId
   * @return {Number} - index of the game
   * @private
   */
  _findGame(playerId) {
    for (let i = 0; i < this.games.length; i++) {
      if (this.games[i].playerA === playerId || this.games[i].playerB === playerId) {
        return i;
      }
    }

    return null;
  }

  /**
   * Starts a given game
   * @param {string} gameId
   * @private
   */
  _startGame(gameId) {
    const game = this.games[gameId];
    game.started = true;

    this.players[game.playerA].callback({type: 'gameStart'});
    this.players[game.playerB].callback({type: 'gameStart'});

    game.timeout = setTimeout(() => {
      this.endGame(gameId, null, null);
    }, 30000);
  }

  /**
   * Gets given player opponent in given game.
   * @param {string} gameId
   * @param {string} playerId
   * @return {string} - opponent id
   * @private
   */
  _getOpponent(gameId, playerId) {
    const game = this.games[gameId];

    if (game.playerA === playerId) {
      return game.playerB;
    }

    return game.playerA;
  }
}

module.exports = new GamesManager();
