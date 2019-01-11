var express = require('express');
var router = express.Router();


let session = {};
let sessionState = "waiting_players";



/* GET start new session. */
router.get('/start', function(req, res, next) {
  session = {name:"test"};
  sessionState = "running";
  res.send(session);
});

router.get('/end', function(req, res, next) {
  session = {name:"test"};
  sessionState = "results";
  res.send(session);
});

/* GET get session info. */
router.get('/get', function(req, res, next) {
  res.send(session);
});

/* GET get session info. */
router.get('/state', function(req, res, next) {
  res.send(sessionState);
});

module.exports = router;
