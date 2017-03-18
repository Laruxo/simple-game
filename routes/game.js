const express = require('express');
const router = new express.Router();

router.get('/', function(request, response) {
  response.send('start the game');
});

module.exports = router;
