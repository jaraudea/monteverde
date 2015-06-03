var Unit = require('../../models/Unit');

exports.getAll = function(req, res, next) {
  Unit.find({active: true}, '_id name description', function(err, unit) {
    if (err) return next(err);
    res.json(unit)
  });
};