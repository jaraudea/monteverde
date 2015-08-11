require('./Contract')
require('./ServiceType')
require('./Zone')
require('./Vehicle')
require('./TripStatus')

var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var tripSchema = new Schema({
  contract: { type: Schema.Types.ObjectId, ref: 'Contract' },
  serviceType: { type: Schema.Types.ObjectId, ref: 'ServiceType' },
  zone: { type: Schema.Types.ObjectId, ref: 'Zone' },
  tripDate: Date,
	approvedDate: Date,
	disapprovedDate: Date,
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  tripsNumber: Number,
	status:  { type: Schema.Types.ObjectId, ref: 'TripStatus' },
	disapprovalReason: String
});

module.exports = mongoose.model('Trip', tripSchema);