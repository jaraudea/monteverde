var Service = require('../../models/Service');

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
  var dateQuery = req.query.date;

  console.log('contract:' + req.query.contract);
  console.log('serviceType:' + req.query.serviceType);
  console.log('zone:' + req.query.zone);
  console.log('date:' + dateQuery);

  var query = {
    contract: req.query.contract, 
    serviceType: req.query.serviceType, 
    zone: req.query.zone, 
    $or: [{scheduledDate: new Date(dateQuery), executedDate: null}, {executedDate: new Date(dateQuery)}]
  };
  console.log(query)

  Service.find(query, function(err, service) {
    if (err) next(err); 
    else res.json(service);
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
  var service = executedService(req.body);
  Service.update({_id: req.body._id}, Service, function(err, response) {
    if (err) next(err);
    res.sendStatus(200);
  });
};

exports.deleteExecutedService = function(req, res, next) {
  var serviceId = req.params.id;
  Service.remove({_id: serviceId}, function(err, response) {
    if (err) next(err);
    console.log(response);
    res.sendStatus(200);
  });
};