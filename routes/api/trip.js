var Trip = require('../../models/Trip');
var dateTimeHelper = require('../../helpers/DateTimeHelper')

var createTripObj = function(data) {
  var trip = {
    contract: data.contract,
    serviceType: data.serviceType,
    zone: data.zone,
    tripDate: data.date,
    vehicle: data.vehicle,
	  tripsNumber: data.tripsNumber
  }
  return trip
}

exports.create = function(req, res, next) {
  var data = req.body
  var tripObj = createTripObj(data)
  Trip.create(tripObj, function(err, next) {
    if (err) next(err)
    res.sendStatus(200)
  })
}

exports.update = function(req, res, next) {
  var trip = createTripObj(req.body)
  Trip.update({_id: req.params._id}, trip, function(err, response) {
    // response should be { ok: 1, nModified: 1, n: 1 }
    if (err) next(err)
    res.sendStatus(200)
  })
}

exports.delete = function(req, res, next) {
  var tripId = req.params._id;
  Trip.remove({_id: tripId}, function(err, response) {
    if (err) next(err)
    res.sendStatus(200)
  })
}

exports.get = function(req, res, next) {
	Trip.find(req.query, function(err, trips) {
		if (err) next(err);
		res.json(trips);
	})
}