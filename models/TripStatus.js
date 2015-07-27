var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var tripStatusSchema = new Schema({
  code: String,
  name: String,
}, {collection: 'tripstatus'});

module.exports = mongoose.model('TripStatus', tripStatusSchema);