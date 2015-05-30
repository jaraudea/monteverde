var mongoose = require('mongoose');

var dbName = "Monteverde";

mongoose.connect('mongodb://localhost/' + dbName, function (err) {
  if (err) next(err);
  console.log('Connected to Database');
});

module.exports = mongoose;