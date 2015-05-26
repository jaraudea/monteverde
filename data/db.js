var express = require('express');
var mongoose = require('mongoose');
// var app = express();

var dbName = "Monteverde";

mongoose.connect('mongodb://localhost/' + dbName, function (err) {
  if (err) {
    throw err;
  }
  console.log('Connected to Database');
});

module.exports = mongoose;