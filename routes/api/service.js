var Service = require('../../models/Service');
var ServiceStatus = require('../../models/ServiceStatus');
var ConfigService = require('../../models/ConfigService');
var dateTimeHelper = require('../../helpers/DateTimeHelper');

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
  console.log(data.vehicle);
  service.vehicle = data.vehicle;
  if (data.trips === null) {
    service.trips = undefined;
  } else {
    service.trips = data.trips;
  }
  service.quantity = data.quantity
  service.description = data.description
  service.photos =data.photos
  service.status = '556fcd97540893b44a2aef07'

  return service;
}

var scheduledService = function(data, svc) {
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
  service.scheduledDate = data.date
  service.status = '556fcda1540893b44a2aef08'

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
    query['$or'] = [{scheduledDate: queryDate, executedDate: null}, {executedDate: queryDate}];
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
  var queryDate = new Date(req.body.date);
  var firstDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
  var lastDay = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0);
  var query = { 
    configService: req.body.configService,
    $or: [{scheduledDate: {$gte: new Date(firstDay), $lte: new Date(lastDay)}}, {executedDate: {$gte: new Date(firstDay), $lte: new Date(lastDay)}}]
  };
  Service.findOne(query, function(err, svc) {
    if (err) next(err);
    if (svc) {
      var service = scheduledService(req.body, svc);
      service.save();
      res.sendStatus(200);
    } else {
      var service = scheduledService(req.body);
      Service.create(service, function(err, response) {
        if (err) next(err);
        res.sendStatus(200);
      });
    }
  });
};

exports.executeService = function(req, res, next) {
  var queryDate = new Date(req.body.date);
  var firstDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
  var lastDay = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0);
  var query = { 
    configService: req.body.configService,
    $or: [{scheduledDate: {$gte: new Date(firstDay), $lte: new Date(lastDay)}}, {executedDate: {$gte: new Date(firstDay), $lte: new Date(lastDay)}}]
  };
  Service.findOne(query, function(err, svc) {
    if (err) next(err);
    if (svc) {
      var service = executedService(req.body, svc);
      service.save();
      res.sendStatus(200);
    } else {
      var service = executedService(req.body);
      Service.create(service, function(err, response) {
        if (err) next(err);
        res.sendStatus(200);
      });
    }
  });
};

exports.approveService = function(req, res, next) {
  var approvedDate = dateTimeHelper.truncateDateTime(new Date());
  Service.update({_id: req.params._id}, {status: '556fcd3f540893b44a2aef03', approvedDate: approvedDate}, function(err, response) {
    // response should be { ok: 1, nModified: 1, n: 1 }
    if (err) next(err);
    res.sendStatus(200);
  });
};

exports.disapproveService = function(req, res, next) {
  var disapprovedDate = dateTimeHelper.truncateDateTime(new Date());
  Service.findOne({_id: req.params._id}, function(err, service) {
    if (err) next(err);
    if (!service) res.sendStatus(400, 'Servicio no encontrado');
    service.status = '556fcd8f540893b44a2aef06';
    service.disapprovedDate = disapprovedDate;
    if (typeof service.disapprovalReason != 'undefined') {
      service.disapprovalReason = disapprovedDate.toISOString().substr(0, 10) + ': ' + req.body.reason + '\n' + service.disapprovalReason;
    } else {
      service.disapprovalReason = req.body.reason;
    }
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
    svc.save(function(err, data) {
      if (err) next(err);
      res.sendStatus(200);
    });
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
    $or: [ {executedDate: null, scheduledDate: {$gte: req.query.startDate, $lte: req.query.endDate}}, {executedDate: {$gte: req.query.startDate, $lte: req.query.endDate}}]
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

exports.getExecutionPercentage = function(req, res, next) {
  var dateFilter = getDateFilter(new Date(req.query.date));
  var query = {
    contract: req.query.contract,
    serviceType: req.query.serviceType,
    zone: req.query.zone
  };
  var allScheduledQuery = query;
  allScheduledQuery['scheduledDate'] = {$lte: dateFilter.endDate, $gte: dateFilter.startDate};
  Service.count(allScheduledQuery , function(err, response) {
    if (response === 0) {
      res.json({executionPercentage: ""});
    } else {
      var allExecutedQuery = query;
      allExecutedQuery['executedDate'] = {$lte: dateFilter.endDate, $gte: dateFilter.startDate };
      allExecutedQuery['status'] = {$ne: '556fcda1540893b44a2aef08'};
      Service.count(allExecutedQuery, function(err, response1) {
        var result = ((response1 / response) * 100)
        res.json({executionPercentage: result.toFixed(2)});
      });
    }
  });
};

exports.getServiceInMonth = function(req, res, next) {
  var query = req.query;
  if (typeof query.date != 'undefined') {
    var queryDate = new Date(query.date);
    var firstDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
    var lastDay = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0);
    delete query['date'];
    query['$or'] = [{scheduledDate: {$gte: new Date(firstDay), $lte: new Date(lastDay)}}, {executedDate: {$gte: new Date(firstDay), $lte: new Date(lastDay)}}];
  }
  Service.findOne(query).populate('configService').exec(function(err, service) {
    if (err) next(err);
    res.json(service);
  });
}

var getDateFilter = function(date) {
  var dateFilter = {};
  if (date.getDate() > 15) {
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 16, 0, 0, 0);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    dateFilter = {startDate: firstDay, endDate: lastDay};
  } else {
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 15, 23, 59, 59);
    dateFilter = {startDate: firstDay, endDate: lastDay};
  }
  return dateFilter;
};

exports.getScheduledServicesWithoutExecution = function(req, res, next) {
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 2);
  Service.find({scheduledDate: {$lt: currentDate}, executedDate: null}, 'scheduledDate configService')
    .populate('configService', 'code')
    .exec(function(err, services) {
      if (err) next(err);
      res.json(services);
  });
};

exports.getScheduledServicesWithoutApprobation = function(req, res, next) {
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 3);
  Service.find({scheduledDate: {$lt: currentDate}, executedDate: {$ne: null} ,approvedDate: null}, 'scheduledDate configService')
    .populate('configService', 'code')
    .exec(function(err, services) {
      if (err) next(err);
      res.json(services);
  });
};

exports.getOldDisapprovedServices = function(req, res, next) {
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  Service.find({disapprovedDate: {$lt: currentDate}, status: '556fcd8f540893b44a2aef06'}, 'disapprovedDate configService')
    .populate('configService', 'code')
    .exec(function(err, services) {
      if (err) next(err);
      res.json(services);
  });
};

exports.getScheduledServices = function(req, res, next) {
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
    query['$or'] = [{scheduledDate: queryDate}];
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

exports.getSchedulingPercentage = function(req, res, next) {
	var date = new Date(req.query.date)
	var dateFilter = getDateFilter(date)
	var period = date.getDate() > 15 ?  2 : 1

	var svcsInPeriodQuery = {
		contract: req.query.contract,
		serviceType: req.query.serviceType,
		zone: req.query.zone
	};
	svcsInPeriodQuery['period'] = period;

	ConfigService.count(svcsInPeriodQuery, function(err, response) {
		if (response === 0) {
			res.json({schedulingPercentage: ""});
		} else {
			var query = {
				contract: req.query.contract,
				serviceType: req.query.serviceType,
				zone: req.query.zone
			};
			query['scheduledDate'] = {$lte: dateFilter.endDate, $gte: dateFilter.startDate };
			Service.count(query, function(err, response1) {
				var result = ((response1 / response) * 100)
				res.json({schedulingPercentage: result.toFixed(2)});
			});
		}
	});
}