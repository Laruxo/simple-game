const MatchMaker = require('../components/MatchMaker');
const matchmaker = new MatchMaker();

let id = 0;

module.exports = {
  '/': function(ws) {
    const playerId = (++id).toString();

    ws.send(JSON.stringify({
      type: 'id',
      id: playerId,
    }));

    ws.on('message', handleMessage.bind(null, ws, playerId));
    ws.on('close', handleClose.bind(null, playerId));
  },
};

/**
 * Handles incoming message from web socket
 * @param {WebSocket} ws
 * @param {string} playerId
 * @param {string} message
 */
function handleMessage(ws, playerId, message) {
  // TODO: implement sessions
  if (message === 'joinQueue') {
    matchmaker.addToQueue({
      id: playerId,
      response: function(response) {
        ws.send(JSON.stringify(response));
      },
    });
    ws.send(JSON.stringify({
      type: 'averageWait',
      time: matchmaker.getAverageWait(),
    }));
  }
}

/**
 * Handles web socket closing
 * @param {string} playerId
 */
function handleClose(playerId) {
  console.log(playerId);
  matchmaker.removeFromQueue(playerId);
}
