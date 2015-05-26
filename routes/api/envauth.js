var EnvironmentalAuthority = require('../../models/EnvironmentalAuthority');

exports.getAll = function(req, res, next) {
  EnvironmentalAuthority.find({active: true}, '_id name', function(err, envAuth) {
    if (err) return next(err);
    res.json(envAuth)
  });
};