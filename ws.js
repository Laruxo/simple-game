const url = require('url');
const cookie = require('cookie');
const cookieSign = require('cookie-signature');

const routes = {
  '/matchmaking': require('./controllers/matchmaking-ws'),
  '/game': require('./controllers/game-ws'),
};

/**
 * Handles incoming web socket connection
 * @param {WebSocket} ws
 */
module.exports = ws => {
  // Add session to web socket request
  const sid = cookie.parse(ws.upgradeReq.headers.cookie).sid.slice(2);
  ws.upgradeReq.sessionID = cookieSign.unsign(sid, process.env['SESSION_SECRET']);

  const path = url.parse(ws.upgradeReq.url, true).pathname;
  if (!handleRoute(path, ws)) {
    console.error('path does not exist');
  }

  ws.on('error', function(error) {
    console.error('ws', error);
  });

  ws.on('close', function(code) {
    console.log('Disconnected. Code ' + code);
  });
};

/**
 * Handles route which web socket is requesting
 * @param {string} path
 * @param {WebSocket} ws
 * @return {boolean} - true if route was handled, false otherwise
 */
function handleRoute(path, ws) {
  if (routes.hasOwnProperty(path)) {
    routes[path](ws);
    return true;
  }

  return false;
}
