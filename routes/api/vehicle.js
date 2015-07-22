var Vehicle = require('../../models/Vehicle');

exports.getAll = function(req, res, next) {
  Vehicle.find({active: true}, '_id plate cubicMeters').sort('plate').exec(function(err, vehicle) {
    if (err) return next(err);
    res.json(vehicle)
  });
};