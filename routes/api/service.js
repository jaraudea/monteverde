var Service = require('../../models/Service');
var Photo = require('../../models/Photo');

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
    quantity: data.quantity,
    description: data.description,
    photos: data.photos
  }
  return service;
}

exports.getExecutedServices = function(req, res, next) {
  var contractQuery = req.query.contract;
  var serviceTypeQuery = req.query.serviceType;
  var zoneQuery = req.query.zone;
  var dateQuery = req.query.date;

  console.log(contractQuery);
  console.log(serviceTypeQuery);
  console.log(zoneQuery);
  console.log(dateQuery);

  var query = {
    contract: contractQuery, 
    serviceType: serviceTypeQuery, 
    zone: zoneQuery, 
    $or: [{scheduledDate: new Date(dateQuery), executedDate: null}, {executedDate: new Date(dateQuery)}]
  };

  Service.find(query, function(err, service) {
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

  service.
  Service.create(service, function(err, next) {
    if (err) next(err);
    res.sendStatus(200);
  });
};

exports.approveService = function(req, res, next) {
  console.log(req);
  res.sendStatus(200);
};

exports.disapproveService = function(req, res, next) {
  console.log(req);
  res.sendStatus(200);
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