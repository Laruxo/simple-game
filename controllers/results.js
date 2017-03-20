const manager = require('../components/GamesManager');
const express = require('express');
const router = new express.Router();

router.get('/', function(request, response) {
  const data = {
    title: 'Results',
    results: manager.getLastResult(request.sessionID),
  };

  response.render('results', data);
});

module.exports = router;
