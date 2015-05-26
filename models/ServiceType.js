var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var svcTypeSchema = new Schema({
  name: String,
  active: Boolean
});

module.exports = mongoose.model('ServiceType', svcTypeSchema);