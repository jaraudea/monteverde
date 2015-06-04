var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var svcStatusSchema = new Schema({
  code: String,
  name: String,
});

module.exports = mongoose.model('ServiceStatus', svcStatusSchema);