var mongoose = require('mongoose');

var dbName = "pruebas_monteverde";

mongoose.connect('mongodb://localhost/' + dbName, function (err) {
  if (err) throw err;
  console.log('Connected to Database');
});

module.exports = mongoose;