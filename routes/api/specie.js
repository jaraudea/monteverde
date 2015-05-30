var Specie = require('../../models/Specie');

exports.getAll = function(req, res, next) {
  Specie.find({active: true}, '_id name', function(err, zone) {
    if (err) return next(err);
    res.json(zone)
  });
};