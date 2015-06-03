var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var unitSchema = new Schema({
  name: String,
  description: String,
  active: Boolean
});

module.exports = mongoose.model('Unit', unitSchema);