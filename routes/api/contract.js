var Contract = require('../../models/Contract');

exports.getAll = function(req, res, next) {
  Contract
    .find({}, '_id, contractNumber serviceType zones')
    .sort({ contractNumber: 1 })
    .populate("serviceType")
    .populate("zones").exec(function(err, contract) {
    if (err) return next(err);
    res.json(contract)
  });
};