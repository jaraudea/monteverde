var ConfigService = require('../../models/ConfigService');

exports.getByCode = function(req, res, next) {
  ConfigService.find({code: req.params.id}, function(err, configService) {
    if (err) return next(err);
    if (!configService.id) return res.sendStatus(404);
    res.json(configService)
  });
};

exports.create = function(req, res, next) {
  res.sendStatus(200);
};

exports.update = function(req, res, next) {
  res.sendStatus(200);
};