var ConfigService = require('../../models/ConfigService');

var grassService = function(data, next) {
  var configService = {
    code: data.code,
    contract: new ObjectId(data.contract),
    serviceType: new ObjectId(data.serviceType),
    team: new ObjetId(data.team),
    unit: new ObjetId(data.units),
    address: data.address,
    phone: data.telephone,
    area: data.area,
    description: data.description,
    active: data.active
  }
  return configService;
}

var pruningService = function(data, next) {
  var configService = {
    code: data.code,
    contract: new ObjectId(data.contract),
    serviceType: new ObjectId(data.serviceType),
    team: new ObjectId(data.team),
    unit: new ObjectId(data.units),
    address: data.address,
    phone: data.telephone,
    envAuthority: new ObjectId(data.envAuthority),
    description: data.description,
    treeSpeciesByTask: [],
    active: data.active
  }

  data.treeSpeciesByTask.forEach(function(item) {
    var treeSpecieByTask = {
      specie: new ObjectId(item.specie), 
      task: new ObjectId(item.task), 
      quantity: item.quantity
    };
    configService.treeSpeciesByTask.push(treeSpecieByTask);
  });
  return configService;
}

exports.getByCode = function(req, res, next) {
  ConfigService.find({code: req.params.id}, function(err, configService) {
    if (err) return next(err);
    if (!configService.id) return res.sendStatus(404);
    res.json(configService)
  });
};

exports.create = function(req, res, next) {
  var data = req.body;
  console.log(data);
  res.sendStatus(200);
};

exports.update = function(req, res, next) {
  res.sendStatus(200);
};