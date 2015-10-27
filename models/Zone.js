var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var zoneSchema = new Schema({
  name: String,
  city: String,
  active: Boolean,
  code: String
});

module.exports = mongoose.model('Zone', zoneSchema);