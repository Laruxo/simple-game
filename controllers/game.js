const express = require('express');
const router = new express.Router();

router.get('/', function(request, response) {
  response.render('game', {
    title: 'The Game',
  });
});

module.exports = router;
