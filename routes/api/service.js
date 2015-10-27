var Service = require('../../models/Service'),
    ConfigService = require('../../models/ConfigService'),
    auditHelper = require('../../helpers/AuditHelper'),
    dateTimeHelper = require('../../helpers/DateTimeHelper');

//TODO move to constants
const APPROVED_STATUS = '556fcd3f540893b44a2aef03'
const DISAPPROVED_STATUS = '556fcd8f540893b44a2aef06'
const EXECUTED_STATUS = '556fcd97540893b44a2aef07'
const SCHEDULED_STATUS = '556fcda1540893b44a2aef08'
const CORRECTED_STATUS = '556fcd73540893b44a2aef04'
const REMOVED_STATUS = '55c982e3905e1eb799be2501'

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
  service.vehicle = data.vehicle;
  if (data.trips === null) {
    service.trips = undefined;
  } else {
    service.trips = data.trips;
  }
  service.quantity = data.quantity
  service.description = data.description
  service.photos =data.photos
  service.status = EXECUTED_STATUS

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
  service.quantity = data.quantity
  service.scheduledDate = data.date
  service.status = SCHEDULED_STATUS

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
  query['status'] = {$ne: REMOVED_STATUS}

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
    $or: [{scheduledDate: {$gte: new Date(firstDay), $lte: new Date(lastDay)}}, {executedDate: {$gte: new Date(firstDay), $lte: new Date(lastDay)}}],
    status: {$ne: REMOVED_STATUS}
  };
  Service.findOne(query, function(err, svc) {
    if (err) next(err);
    var auditType;
    var serviceId;
    if (svc) {
      var service = scheduledService(req.body, svc);
      service.save(function(err) {
        if(err) next(err)
        auditHelper.createAudit(auditHelper.MODIFIED_TYPE, req.user._id, service._id, function(err) {
          if(err) next(err)
          res.sendStatus(200);
        });
      });
    } else {
      var service = scheduledService(req.body);
      Service.create(service, function(err, newService) {
        if (err) next(err);
        auditHelper.createAudit(auditHelper.SCHEDULED_TYPE, req.user._id, newService._id, function(err) {
          if(err) next(err)
          res.sendStatus(200);
        });
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
    $or: [{scheduledDate: {$gte: new Date(firstDay), $lte: new Date(lastDay)}}, {executedDate: {$gte: new Date(firstDay), $lte: new Date(lastDay)}}],
    status: {$ne: REMOVED_STATUS}
  };
  Service.findOne(query, function(err, svc) {
    if (err) next(err);
    var auditType = auditHelper.EXECUTED_TYPE
    if (svc) {
      if (typeof svc.executedDate !== 'undefined') auditType = auditHelper.MODIFIED_TYPE

      var service = executedService(req.body, svc);
      service.save(function(err) {
        if(err) next(err)
        auditHelper.createAudit(auditType, req.user._id, service._id, function(err) {
          if(err) next(err)
          res.sendStatus(200);
        });
      });
    } else {
      var service = executedService(req.body);
      Service.create(service, function(err, newService) {
        if (err) next(err);
        auditHelper.createAudit(auditType, req.user._id, newService._id, function(err) {
          if(err) next(err)
          res.sendStatus(200);
        });
      });
    }
  });
};

exports.approveService = function(req, res, next) {
  var approvedDate = dateTimeHelper.truncateDateTime(new Date());
  Service.update({_id: req.params._id}, {status: APPROVED_STATUS, approvedDate: approvedDate}, function(err, response) {
    // response should be { ok: 1, nModified: 1, n: 1 }
    if (err) next(err);
    auditHelper.createAudit(auditHelper.APPROVED_TYPE, req.user._id, req.params._id, function(err) {
      if(err) next(err)
      res.sendStatus(200);
    });
  });
};

exports.disapproveService = function(req, res, next) {
  var disapprovedDate = dateTimeHelper.truncateDateTime(new Date());
  Service.findOne({_id: req.params._id}, function(err, service) {
    if (err) next(err);
    if (!service) res.sendStatus(400, 'Servicio no encontrado');
    service.status = DISAPPROVED_STATUS;
    service.disapprovedDate = disapprovedDate;
    if (typeof service.disapprovalReason != 'undefined') {
      service.disapprovalReason = disapprovedDate.toISOString().substr(0, 10) + ': ' + req.body.reason + '\n' + service.disapprovalReason;
    } else {
      service.disapprovalReason = req.body.reason;
    }
    service.save(function (err) {
      if (err) next(err);
      auditHelper.createAudit(auditHelper.DISAPPROVED_TYPE, req.user._id, req.params._id, function(err) {
        if(err) next(err)
        res.sendStatus(200);
      });
    });
  });
};

exports.updateExecutedService = function(req, res, next) {
  Service.findOne({_id: req.params._id}, function (err, service) {
    if (err) next(err);
    if (!service) res.sendStatus(400, 'Servicio no encontrado');
    var oldStatus = service.status
    var svc = executedService(req.body, service);
    if (oldStatus == DISAPPROVED_STATUS || oldStatus == CORRECTED_STATUS) {
      svc.status = CORRECTED_STATUS;
    }
    svc.save(function(err, data) {
      if (err) next(err);
      var auditType = oldStatus == DISAPPROVED_STATUS ? auditHelper.CORRECTED_TYPE : auditHelper.MODIFIED_TYPE
      auditHelper.createAudit(auditType, req.user._id, service._id, function(err) {
        if(err) next(err)
        res.sendStatus(200);
      });
    });
  });
};

exports.deleteExecutedService = function(req, res, next) {
  var serviceId = req.params._id;
  Service.findOne({_id: serviceId}, function(err, service) {
    if (err) next(err);
    if (!service) res.sendStatus(400, 'Servicio no encontrado');
    service.status = REMOVED_STATUS
    service.save(function(err) {
      auditHelper.createAudit(auditHelper.REMOVED_TYPE, req.user._id, serviceId, function(err) {
        if(err) next(err)
        res.sendStatus(200);
      });
    });
  });
};

exports.getServices = function(req, res, next) {
  var query = {
    contract: req.query.contract,
    serviceType: req.query.serviceType,
    zone: req.query.zone,
    $or: [ {executedDate: null, scheduledDate: {$gte: req.query.startDate, $lte: req.query.endDate}}, {executedDate: {$gte: req.query.startDate, $lte: req.query.endDate}}],
    status: {$ne: REMOVED_STATUS}
  }

  Service
    .find(query)
    .populate('configService', 'code description location treeSpeciesByTask')
    .populate('team', 'name')
    .populate('contract')
    .populate('unit', 'name')
    .populate('status', 'name')
    .exec(function(err, services) {
      if (err) next(err);
      var modifiedServices = []
      if (services.length <= 0) res.json(services);
      services.forEach(function (service) {
        auditHelper.populateAudit(service, function(err, svc) {
          modifiedServices.push(svc)
          if (services.length == modifiedServices.length) {
            res.json(modifiedServices);
          }
        })
      })
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
  allScheduledQuery['status'] = {$ne: REMOVED_STATUS};
  Service.count(allScheduledQuery , function(err, response) {
    if (response === 0) {
      res.json({executionPercentage: ""});
    } else {
      var allExecutedQuery = query;
      allExecutedQuery['executedDate'] = {$lte: dateFilter.endDate, $gte: dateFilter.startDate };
      allExecutedQuery['status'] = {$ne: SCHEDULED_STATUS, $ne: REMOVED_STATUS};
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
  query['status'] = {$ne: REMOVED_STATUS}

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
  Service.find({scheduledDate: {$lt: currentDate}, executedDate: null, status: {$ne: REMOVED_STATUS}}, 'scheduledDate configService zone')
    .populate('configService', 'code')
    .populate('zone', 'code')
    .exec(function(err, services) {
      if (err) next(err);
      res.json(services);
  });
};

exports.getScheduledServicesWithoutApprobation = function(req, res, next) {
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 3);
  Service.find({scheduledDate: {$lt: currentDate}, executedDate: {$ne: null} ,approvedDate: null, status: {$ne: REMOVED_STATUS}}, 'scheduledDate configService zone')
    .populate('configService', 'code')
    .populate('zone', 'code')
    .exec(function(err, services) {
      if (err) next(err);
      res.json(services);
  });
};

exports.getOldDisapprovedServices = function(req, res, next) {
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  Service.find({disapprovedDate: {$lt: currentDate}, status: DISAPPROVED_STATUS, status: {$ne: REMOVED_STATUS}}, 'disapprovedDate configService zone')
    .populate('configService', 'code')
    .populate('zone', 'code')
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
  query['status'] = {$ne: REMOVED_STATUS}

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
		zone: req.query.zone,
    active: true
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
      query['status'] = {$ne: REMOVED_STATUS}
			Service.count(query, function(err, response1) {
				var result = ((response1 / response) * 100)
				res.json({schedulingPercentage: result.toFixed(2)});
			});
		}
	});
}