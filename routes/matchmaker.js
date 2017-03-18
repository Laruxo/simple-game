const express = require('express');
const router = new express.Router();

router.get('/', function(request, response) {
  response.render('matchmaker', {
    title: 'Matchmaking',
  });
});

module.exports = router;
