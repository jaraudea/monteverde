var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var serviceSchema = new Schema({
  contract: { type: Schema.Types.ObjectId, ref: 'Contract' },
  serviceType: { type: Schema.Types.ObjectId, ref: 'ServiceType' },
  zone: { type: Schema.Types.ObjectId, ref: 'Zone' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
  scheduledDate: Date,
  executedDate: Date,
  approvedDate: Date,
  disapprovedDate: Date,
  correctedDate: Date,
  configService: { type: Schema.Types.ObjectId, ref: 'ConfigService' },
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  quantity: Number,
  description: String,
  trips: Number,
  status: { type: Schema.Types.ObjectId, ref: 'ServiceStatus' },
  disapproveNotes: String,
  photos: [{name: String}]
});

module.exports = mongoose.model('Service', serviceSchema);