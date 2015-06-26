var Service = require('../../models/Service');
var ServiceStatus = require('../../models/ServiceStatus');

var executedService = function(data, svc) {
  var service = {};

  if (typeof svc != 'undefined') {
    service = svc;
  }
  
  service.contract = data.contract
  service.serviceType = data.serviceType
  service.zone =  data.zone
  service.team = data.team
  service.unit =  data.unit
  service.configService = data.configService
  service.executedDate = data.date
  service.vehicle = data.vehicle
  service.trips = data.trips
  service.quantity = data.quantity
  service.description = data.description
  service.photos =data.photos
  service.status = '556fcd97540893b44a2aef07'

  return service;
}

exports.getExecutedServices = function(req, res, next) {
  var parameters = req.params;
  var query = req.query;

  if (typeof parameters._id != 'undefined') {
    for (param in parameters) {
      query[param] = parameters[param];
    }
  }

  if (typeof query.date != 'undefined') {
    var queryDate = query.date;
    delete query['date'];
    query['$or'] = [{scheduledDate: new Date(queryDate), executedDate: null}, {executedDate: new Date(queryDate)}];
  }

  Service
    .find(query)
    .populate('contract')
    .populate('serviceType')
    .populate('zone')
    .populate('team')
    .populate('unit')
    .populate('configService')
    .populate('vehicle')
    .populate('status')
    .exec(function(err, service) {
      if (err) next(err);
      res.json(service);
   });
}

exports.scheduleService = function(req, res, next) {
  console.log(req);
  res.sendStatus(200);
};

exports.executeService = function(req, res, next) {
  var service = executedService(req.body);
  
  Service.create(service, function(err, response) {
    if (err) next(err);
     res.sendStatus(200);
  });
};

exports.approveService = function(req, res, next) {
  var approvedDate = truncateDate(new Date());
  Service.update({_id: req.params._id}, {status: '556fcd3f540893b44a2aef03', approvedDate: approvedDate}, function(err, response) {
    // response should be { ok: 1, nModified: 1, n: 1 }
    if (err) next(err);
    res.sendStatus(200);
  });
};

exports.disapproveService = function(req, res, next) {
  var disapprovedDate = truncateDate(new Date());
  Service.findOne({_id: req.params._id}, function(err, service) {
    if (err) next(err);
    if (!service) res.sendStatus(400, 'Servicio no encontrado');
    service.status = '556fcd8f540893b44a2aef06';
    service.disapprovedDate = disapprovedDate;
    if (typeof service.disapprovalReason != 'undefined') {
      service.disapprovalReason = req.body.reason + '\n------------\n' + service.disapprovalReason;
    } else {
      service.disapprovalReason = req.body.reason;
    }
    console.log(service);
    service.save();
    res.sendStatus(200);
  });
};

exports.updateScheduledService = function(req, res, next) {
  console.log(req);
  res.sendStatus(200);
};

exports.updateExecutedService = function(req, res, next) {
  Service.findOne({_id: req.params._id}, function (err, service) {
    if (err) next(err);
    if (!service) res.sendStatus(400, 'Servicio no encontrado');
    var oldStatus = service.status
    var svc = executedService(req.body, service);
    
    if (oldStatus == '556fcd8f540893b44a2aef06' || oldStatus == '556fcd73540893b44a2aef04') { // if status is disapproved or corrected, then define status as corrected
      svc.status = '556fcd73540893b44a2aef04'; 
    }
    svc.save();
    res.sendStatus(200);
  });
};

exports.deleteExecutedService = function(req, res, next) {
  var serviceId = req.params._id;
  Service.remove({_id: serviceId}, function(err, response) {
    if (err) next(err);
    res.sendStatus(200);
  });
};

exports.getServices = function(req, res, next) {
  var query = {
    contract: req.query.contract,
    serviceType: req.query.serviceType,
    zone: req.query.zone,
    $or: [ {executedDate: null, scheduledDate: {$gte: new Date(req.query.startDate), $lt: new Date(req.query.endDate)}}, {executedDate: {$gte: new Date(req.query.startDate), $lt: new Date(req.query.endDate)}}]
  }

  Service
    .find(query)
    .populate('configService', 'code description location treeSpeciesByTask')
    .populate('team', 'name')
    .populate('contract')
    .populate('unit', 'name')
    .populate('status', 'name')
    .exec(function(err, service) {
      if (err) next(err);
      res.json(service);
  });
};

var truncateDate = function(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

exports.getExecutionPercentage = function(req, res, next) {
  res.json({executionPercentage: 25.5});
}