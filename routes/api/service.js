var Service = require('../../models/Service');
var Photo = require('../../models/Photo');

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
  console.log(req.query);
  Service.find(req.query, function(err, service) {
    if (err) next(err); 
    res.json(service);
  });
}

exports.scheduleService = function(req, res, next) {
  console.log(req);
  res.sendStatus(200);
};

exports.executeService = function(req, res, next) {
  var data = req.service;
  console.log(data);

  var service = executedService(data);
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