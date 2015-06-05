var Service = require('../../models/Service');

exports.getByScheduledDate = function(req, res, next) {
  res.json({})
}

exports.getByExecutedDate = function(req, res, next) {
  res.json({})
}

exports.scheduleService = function(req, res, next) {
  res.sendStatus(200);
};

exports.executeService = function(req, res, next) {
  //TODO: validate if service has been disapproved or it's a new one.
  //TODO: validate that execution has photos.
  res.sendStatus(200);
};

exports.approveService = function(req, res, next) {
  res.sendStatus(200);
};

exports.disapproveService = function(req, res, next) {
  res.sendStatus(200);
};

exports.updateScheduledService = function(req, res, next) {
  res.sendStatus(200);
};

exports.updateExecutedService = function(req, res, next) {
  res.sendStatus(200);
};