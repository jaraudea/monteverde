var Task = require('../../models/Task');

exports.getAll = function(req, res, next) {
  Task.find({active: true}, '_id name', function(err, task) {
    if (err) return next(err);
    res.json(task)
  });
};