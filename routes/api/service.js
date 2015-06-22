var Service = require('../../models/Service');
var ServiceStatus = require('../../models/ServiceStatus');

var executedService = function(data) {
  var service = {
    configService: data.configService,
    executedDate: data.date,
    vehicle: data.vehicle,
    trips: data.trips,
    quantity: data.quantity,
    description: data.description
  }
  return service;
}

exports.getExecutedServices = function(req, res, next) {
  // db.services.find()
  var contractQuery = req.query.contract;
  var serviceTypeQuery = req.query.serviceType;
  var zoneQuery = req.query.zone;
  var dateQuery = req.query.date;

  console.log(contractQuery);
  console.log(serviceTypeQuery);
  console.log(zoneQuery);
  console.log(dateQuery);

  Service.find({$or: [{scheduledDate: new Date(dateQuery), executedDate: null}, {executedDate: new Date(dateQuery)}]})
    .populate({ path: 'configService', match: { contract: contractQuery, serviceType: serviceTypeQuery, zone: zoneQuery}})
    .exec(function(err, service) {
    if (err) next(err); 
    if (!service.configService) res.json({});
    else res.json(service);
  });
}

exports.scheduleService = function(req, res, next) {
  console.log(req);
  res.sendStatus(200);
};

exports.executeService = function(req, res, next) {
  var data = req.body;
  console.log(data);

  var service = executedService(data);
  Service.create(service, function(err, next) {
    if (err) next(err);
    res.sendStatus(200);
  });
};

exports.approveService = function(req, res, next) {
  Service.update({_id: req.params._id}, {status: '556fcd3f540893b44a2aef03'}, function(err, response) {
    // response should be { ok: 1, nModified: 1, n: 1 }
    if (err) next(err);
    res.sendStatus(200);
  });
};

exports.disapproveService = function(req, res, next) {
  Service.update({_id: req.params._id}, {status: '556fcd8f540893b44a2aef06'}, function(err, response) {
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
  console.log(req);
  res.sendStatus(200);
};

exports.deleteExecutedService = function(req, res, next) {
  console.log(req);
  res.sendStatus(200);
};

exports.getServices = function(req, res, next) {
  var query = {
    contract: req.query.contract,
    serviceType: req.query.serviceType,
    zone: req.query.zone,
    executedDate: {$gte: new Date(req.query.startDate), $lt: new Date(req.query.endDate)}
  }
  Service.find(query).populate('configService', 'code location treeSpeciesByTask').populate('contract', 'client').populate('unit', 'name').populate('status', 'name').exec(function(err, service) {
    if (err) next(err);
    console.log(service);
    res.json(service);
  });
};