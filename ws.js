const url = require('url');

const routes = {
  matchmaking: require('./routes/matchmaker-ws'),
  game: require('./routes/game-ws'),
};

/**
 * Handles incoming web socket connection
 * @param {WebSocket} ws
 */
function handleWsConnection(ws) {
  const path = url.parse(ws.upgradeReq.url, true).pathname;

  if (!handleRoute(path, ws)) {
    console.log('path does not exist');
  }

  ws.on('error', function(error) {
    console.log('ws', error);
  });

  ws.on('close', function(code) {
    console.log('Disconnected. Code ' + code);
  });
}

/**
 * Handles route which web socket is requesting
 * @param {string} path
 * @param {WebSocket} ws
 * @return {boolean} - true if route was handled, false otherwise
 */
function handleRoute(path, ws) {
  const fragments = path.split('/');
  if (fragments[0] === '') {
    fragments.shift();
  }

  const routeGroup = fragments.shift();
  if (routes.hasOwnProperty(routeGroup)) {
    let path = fragments.join('/');
    if (path === '') {
      path = '/';
    }

    if (routes[routeGroup].hasOwnProperty(path)) {
      routes[routeGroup][path](ws);
      return true;
    }
  }

  return false;
}

module.exports = handleWsConnection;
