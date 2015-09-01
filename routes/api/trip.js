var Trip = require('../../models/Trip'),
		auditHelper = require('../../helpers/AuditHelper')
		dateTimeHelper = require('../../helpers/DateTimeHelper')

//TODO move to constants
const APPROVED_TRIP_STATUS = '55b555659e52ff86df79d7f9'
const EXECUTED_TRIP_STATUS = '55b555a69e52ff86df79d7fb'
const DISAPPROVED_TRIP_STATUS = '55b555789e52ff86df79d7fa'
const REMOVED_TRIP_STATUS = '55c982fb905e1eb799be2502'

var createTripObj = function(data) {
  var trip = {
    contract: data.contract,
    serviceType: data.serviceType,
    zone: data.zone,
    tripDate: data.date,
    vehicle: data.vehicle,
	  tripsNumber: data.tripsNumber,
	  status: EXECUTED_TRIP_STATUS
  }
  return trip
}

exports.create = function(req, res, next) {
  var data = req.body
  var tripObj = createTripObj(data)
  Trip.create(tripObj, function(err, newTrip) {
    if (err) next(err)
		auditHelper.createAudit(auditHelper.CREATED_TYPE, req.user._id, newTrip._id, function(err) {
			if(err) next(err)
			res.sendStatus(200)
		})
  })
}

exports.update = function(req, res, next) {
  var trip = createTripObj(req.body)
	var tripId = req.params._id;
  Trip.update({_id: tripId}, trip, function(err, response) {
    // response should be { ok: 1, nModified: 1, n: 1 }
    if (err) next(err)
		auditHelper.createAudit(auditHelper.MODIFIED_TYPE, req.user._id, tripId, function(err) {
			if(err) next(err)
			res.sendStatus(200)
		})
  })
}

exports.delete = function(req, res, next) {
  var tripId = req.params._id;
  Trip.remove({_id: tripId}, function(err, response) {
    if (err) next(err)
		auditHelper.createAudit(auditHelper.MODIFIED_TYPE, req.user._id, tripId, function(err) {
			if(err) next(err)
			res.sendStatus(200)
		})
  })
}

exports.getTrip = function(req, res, next) {
	var query = req.query
	query['status'] = {$ne: REMOVED_TRIP_STATUS}
	Trip.findOne(query).populate('vehicle').exec( function(err, trip) {
		if (err) next(err);
		res.json(trip);
	})
}

exports.getTrips = function(req, res, next) {
	var query = {
		contract: req.query.contract,
		serviceType: req.query.serviceType,
		zone: req.query.zone,
		tripDate: {$gte: req.query.startDate, $lte: req.query.endDate},
		status: {$ne: REMOVED_TRIP_STATUS}
	}

	Trip.find(query)
		.populate('vehicle', 'plate cubicMeters')
		.populate('status', 'name')
		.exec(function(err, trips) {
			if (err) next(err)
			res.json(trips)
		})
}

exports.approveTrip = function(req, res, next) {
	var approvedDate = dateTimeHelper.truncateDateTime(new Date())
	var tripId = req.params._id
  Trip.update({_id: tripId}, {status: APPROVED_TRIP_STATUS, approvedDate: approvedDate}, function(err, response) {
		if (err) next(err)
		auditHelper.createAudit(auditHelper.APPROVED_TYPE, req.user._id, tripId, function(err) {
			if(err) next(err)
			res.sendStatus(200)
		})
	})
}

exports.disapproveTrip = function(req, res, next) {
	var disapprovedDate = dateTimeHelper.truncateDateTime(new Date())
	Trip.findOne({_id: req.params._id}, function(err, trip) {
		if (err) next(err)
		if (!trip) res.sendStatus(400, 'Viaje no encontrado')
    trip.status = DISAPPROVED_TRIP_STATUS
		trip.disapprovedDate = disapprovedDate
		if (typeof trip.disapprovalReason != 'undefined') {
			trip.disapprovalReason = disapprovedDate.toISOString().substr(0, 10) + ': ' + req.body.reason + '\n' + service.disapprovalReason
		} else {
			trip.disapprovalReason = req.body.reason
		}
		trip.save(function(err) {
			if(err) next(err)
			auditHelper.createAudit(auditHelper.DISAPPROVED_TYPE, req.user._id, req.params._id, function(err) {
				if(err) next(err)
				res.sendStatus(200)
			})
		})
	})
}