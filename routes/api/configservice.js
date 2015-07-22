var ConfigService = require('../../models/ConfigService');

var grassService = function(data) {
  var configService = {
    code: data.code,
    contract: data.contract,
    serviceType: data.serviceType,
    zone: data.zone,
    team: data.team,
    unit: data.unit,
    location: data.location,
    period: data.period,
    area: data.area,
    description: data.description,
    active: (typeof data.active != 'undefined') ? data.active : false
  }
  return configService;
}

var pruningService = function(data) {
  var configService = {
    code: data.code,
    contract: data.contract,
    serviceType: data.serviceType,
    zone: data.zone,
    team: data.team,
    unit: data.unit,
    location: data.location,
    period: data.period,
    envAuthority: data.envAuthority,
    description: data.description,
    treeSpeciesByTask: [],
    active: (typeof data.active != 'undefined') ? data.active : false
  }

  data.treeSpeciesByTask.forEach(function(item) {
    var treeSpecieByTask = {
      specie: item.specie, 
      task: item.task, 
      quantity: item.quantity
    };
    configService.treeSpeciesByTask.push(treeSpecieByTask);
  });
  return configService;
}

var configService = function(data) {
  var confSvc;
  if (data.serviceType === '5563efda45051764c2e3da12') {
    confSvc = grassService(data);
  } else if (data.serviceType === '5563efe645051764c2e3da13') {
    confSvc = pruningService(data);
  } else {
    res.sendStatus(402, 'Parametro no soportado');
  }
  return confSvc;
}

exports.getAllConfigCodes = function(req, res, next) {
  ConfigService.find(req.query, 'code').sort('code').exec(function(err, configServiceCode) {
    if (err) return next(err);
    res.json(configServiceCode);
  });
}

exports.getByCode = function(req, res, next) {
  var query = isEmpty(req.query) ? {code: req.params.code} : req.query;
  ConfigService.find(query, function(err, configService) {
    if (err) return next(err);
    res.json(configService)
  });
};

exports.create = function(req, res, next) {
  var data = req.body;
  var confSvc = configService(data);
  ConfigService.create(confSvc, function(err, next) {
    if (err) next(err);
    res.sendStatus(200);
  });
};

exports.update = function(req, res, next) {
  var confSvc = configService(req.body);
  ConfigService.update({_id: req.body._id}, confSvc, function(err, response) {
    // response should be { ok: 1, nModified: 1, n: 1 }
    if (err) next(err);
    res.sendStatus(200);
  });
};

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}