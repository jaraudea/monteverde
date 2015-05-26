var Contract = require('../../models/Contract');

exports.getAll = function(req, res, next) {
  Contract.find({}, '_id, contractNumber serviceType').populate("serviceType").exec(function(err, contract) {
    if (err) return next(err);
    res.json(contract)
  });
};