var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var zoneSchema = new Schema({
  name: String,
  city: String,
  active: Boolean
});

module.exports = mongoose.model('Zone', zoneSchema);