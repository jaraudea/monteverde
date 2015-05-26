var EnvironmentalAuthority = require('../../models/EnvironmentalAuthority');

exports.getAll = function(req, res, next) {
  EnvironmentalAuthority.find({}, function(err, envAuth) {
    if (err) return next(err);
    res.json(envAuth)
  });
};