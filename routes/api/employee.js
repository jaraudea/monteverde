var Employee = require('../../models/Employee');

exports.getAll = function(req, res, next) {
  Employee.find({active: true}, function(err, employee) {
    if (err) return next(err);
    res.json(employee)
  });
};