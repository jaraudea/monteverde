var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var envAuthSchema = new Schema({
  name: String,
  active: Boolean
});

module.exports = mongoose.model('EnvironmentalAuthority', envAuthSchema);