var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var positionSchema = new Schema({
  name: String,
  active: Boolean
}, {collection: 'CompanyPositions'});

module.exports = mongoose.model('CompanyPosition', taskSchema);