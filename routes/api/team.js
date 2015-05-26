var Team = require('../../models/Team');

exports.getAll = function(req, res, next) {
  Team.find().populate('lider').exec(function(err, team) {
    if (err) return next(err);
    res.json(team)
  });
};