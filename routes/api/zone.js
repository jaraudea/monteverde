var Zone = require('../../models/Zone');

exports.getAll = function(req, res, next) {
  Zone.find({active: true}, '_id name city', function(err, zone) {
    if (err) return next(err);
    res.json(zone)
  });
};