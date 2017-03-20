const manager = require('../components/GamesManager');

module.exports = function(ws) {
  if (manager.isPlayer(ws.upgradeReq.sessionID)) {
    ws.on('message', message => handleMessage(ws, message));
    ws.on('close', () => handleClose(ws));
  } else {
    ws.close(1003, 'not a player');
  }
};

/**
 * Handles incoming message from web socket
 * @param {WebSocket} ws
 * @param {string} message
 */
function handleMessage(ws, message) {
  if (message === 'ready') {
    manager.playerReady(ws.upgradeReq.sessionID, function(response) {
      ws.send(JSON.stringify(response));
    });
  } else if (message === 'win') {
    manager.resolveGame(ws.upgradeReq.sessionID, true);
  }
}

/**
 * Handles web socket closing
 * @param {WebSocket} ws
 */
function handleClose(ws) {
  manager.resolveGame(ws.upgradeReq.sessionID, false);
}
