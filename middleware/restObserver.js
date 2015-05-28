module.exports = function(req, res, next) {
  if (req.method == 'POST' || req.method == 'PUT' || req.method == 'DELETE') {
    if (typeof sockets !== "undefined") {
      sockets.emit ('notifyChanges', {dataUpdated: true});
    }
  }
  next();
};