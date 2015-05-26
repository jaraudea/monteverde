var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var svcTypeSchema = new Schema({
  name: String,
  active: Boolean
});

module.exports = mongoose.model('ServiceType', svcTypeSchema);