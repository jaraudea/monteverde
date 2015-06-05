var ConfigService = require('../../models/ConfigService');

var grassService = function(data, next) {
  var configService = {
    code: data.code,
    contract: data.contract,
    serviceType: data.serviceType,
    team: data.team,
    unit: data.units,
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
    contract: data.contract,
    serviceType: data.serviceType,
    team: data.team,
    unit: data.units,
    address: data.address,
    phone: data.telephone,
    envAuthority: data.envAuthority,
    description: data.description,
    treeSpeciesByTask: [],
    active: data.active
  }

  data.treeSpeciesByTask.forEach(function(item) {
    var treeSpecieByTask = {
      specie: item.kind, 
      task: item.task, 
      quantity: item.quantity
    };
    configService.treeSpeciesByTask.push(treeSpecieByTask);
  });
  return configService;
}

exports.getAllConfigCodes = function(req, res, next) {
  ConfigService.find(req.query, 'code', function(err, configServiceCode) {
    if (err) return next(err);
    res.json(configServiceCode);
  });
}

exports.getByCode = function(req, res, next) {
  var query = isEmpty(req.query) ? {code: req.params.code} : req.query;
  console.log(query)
  ConfigService.find(query, function(err, configService) {
    if (err) return next(err);
    res.json(configService)
  });
};

exports.create = function(req, res, next) {
  var data = req.body;
  console.log(data);
  var confSvc;
  if (data.serviceType === '5563efda45051764c2e3da12') {
    confSvc = grassService(data);
  } else if (data.serviceType === '5563efe645051764c2e3da13') {
    confSvc = pruningService(data);
  } else {
    res.sendStatus(402, 'Parametro no soportado');
  }
  ConfigService.create(confSvc, function(err, next) {
    if (err) next(err);
    res.sendStatus(200);
  });
};

exports.update = function(req, res, next) {
  res.sendStatus(200);
};

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}