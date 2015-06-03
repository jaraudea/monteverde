var SvcType = require('../../models/ServiceType');

exports.getAll = function(req, res, next) {
  SvcType.find({active: true}, '_id name ngId', function(err, svcType) {
    if (err) return next(err);
    res.json(svcType)
  });
};