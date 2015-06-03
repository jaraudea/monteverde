var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var svcTypeSchema = new Schema({
  name: String,
  active: Boolean,
  ngId: { type: Number, min: 1, max: 100 }
});

module.exports = mongoose.model('ServiceType', svcTypeSchema);