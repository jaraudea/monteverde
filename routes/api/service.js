var Service = require('../../models/Service');
var ServiceStatus = require('../../models/ServiceStatus');

var executedService = function(data) {
  var service = {
    contract: data.contract,
    serviceType: data.serviceType,
    zone: data.zone,
    team: data.team,
    unit: data.unit,
    configService: data.configService,
    executedDate: data.date,
    vehicle: data.vehicle,
    trips: data.trips,
    // quantity: data.quantity,
    description: data.description,
    photos: data.photos,
    status: '556fcd97540893b44a2aef07'
  }

  //XXX remove it when quantity has been defined in update
  if (typeof data.quantity != 'undefined') {
    service['quantity'] = data.quantity;
  }
  console.log(service);
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
  Service.update({_id: req.params._id}, {status: '556fcd8f540893b44a2aef06', disapprovedDate: disapprovedDate}, function(err, response) {
    // response should be { ok: 1, nModified: 1, n: 1 }
    if (err) next(err);
    res.sendStatus(200);
  });
};

exports.updateScheduledService = function(req, res, next) {
  console.log(req);
  res.sendStatus(200);
};

exports.updateExecutedService = function(req, res, next) {
  var service = executedService(req.body);
  console.log(req.params._id)
  console.log(Service);
  Service.update({_id: req.params._id}, service, function(err, response) {
    console.log(response);
    if (err) next(err);
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
    .populate('configService', 'code location treeSpeciesByTask')
    .populate('contract', 'client')
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