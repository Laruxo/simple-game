const matchmaker = require('../components/MatchMaker');

module.exports = function(ws) {
  ws.on('message', message => handleMessage(ws, message));
  ws.on('close', () => handleClose(ws));
};

/**
 * Handles incoming message from web socket
 * @param {WebSocket} ws
 * @param {string} message
 */
function handleMessage(ws, message) {
  if (message === 'joinQueue') {
    matchmaker.addToQueue(ws.upgradeReq.sessionID, function(response) {
      ws.send(JSON.stringify(response));
    });

    ws.send(JSON.stringify({
      type: 'averageWait',
      time: matchmaker.getAverageWait(),
    }));
  }
}

/**
 * Handles web socket closing
 * @param {WebSocket} ws
 */
function handleClose(ws) {
  matchmaker.removeFromQueue(ws.upgradeReq.sessionID);
}
