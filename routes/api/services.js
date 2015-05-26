
var express = require('express');
var router = express.Router();

/* GET Environmental Authorities listing. */
exports.envauth = function(req, res) {
  var EnvAuth = require('./models/EnvironmentalAuthority');
  EnvAuth.find(function (err, envAuth) {
    if (err) return next(err);
    console.log('EnvironmentalAuthority: ' + envAuth);
    res.json(envAuth);
  });
}

module.exports = router;