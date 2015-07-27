var Trip = require('../../models/Trip')
var TripStatus = require('../../models/TripStatus');
var dateTimeHelper = require('../../helpers/DateTimeHelper')

var createTripObj = function(data) {
  var trip = {
    contract: data.contract,
    serviceType: data.serviceType,
    zone: data.zone,
    tripDate: data.date,
    vehicle: data.vehicle,
	  tripsNumber: data.tripsNumber,
	  status: '55b555a69e52ff86df79d7fb'
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

exports.getTrip = function(req, res, next) {
	Trip.findOne(req.query, function(err, trip) {
		if (err) next(err);
		res.json(trip);
	})
}

exports.getTrips = function(req, res, next) {
	var query = {
		contract: req.query.contract,
		serviceType: req.query.serviceType,
		zone: req.query.zone,
		tripDate: {$gte: req.query.startDate, $lte: req.query.endDate}
	}

	Trip.find(query)
		.populate('vehicle', 'plate')
		.populate('status', 'name')
		.exec(function(err, trips) {
			if (err) next(err)
			res.json(trips)
		})
}

exports.approveTrip = function(req, res, next) {
	var approvedDate = dateTimeHelper.truncateDateTime(new Date())
	Trip.update({_id: req.params._id}, {status: '55b555659e52ff86df79d7f9', approvedDate: approvedDate}, function(err, response) {
		if (err) next(err)
		res.sendStatus(200)
	})
}

exports.disapproveTrip = function(req, res, next) {
	var disapprovedDate = dateTimeHelper.truncateDateTime(new Date())
	Trip.findOne({_id: req.params._id}, function(err, trip) {
		if (err) next(err)
		if (!trip) res.sendStatus(400, 'Viaje no encontrado')
		trip.status = '55b555789e52ff86df79d7fa'
		trip.disapprovedDate = disapprovedDate
		if (typeof trip.disapprovalReason != 'undefined') {
			trip.disapprovalReason = disapprovedDate.toISOString().substr(0, 10) + ': ' + req.body.reason + '\n' + service.disapprovalReason
		} else {
			trip.disapprovalReason = req.body.reason
		}
		trip.save()
		res.sendStatus(200)
	})
}