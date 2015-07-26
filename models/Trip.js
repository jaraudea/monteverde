var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var tripSchema = new Schema({
  contract: { type: Schema.Types.ObjectId, ref: 'Contract' },
  serviceType: { type: Schema.Types.ObjectId, ref: 'ServiceType' },
  zone: { type: Schema.Types.ObjectId, ref: 'Zone' },
  tripDate: Date,
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  tripsNumber: Number
});

module.exports = mongoose.model('Trip', tripSchema);