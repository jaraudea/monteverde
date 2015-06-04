var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var photoSchema = new Schema({
  name: String,
  file: BSON,
  service: { type: Schema.Types.ObjectId, ref: 'Service' }
});

module.exports = mongoose.model('Photo', photoSchema);