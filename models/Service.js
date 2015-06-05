var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var serviceSchema = new Schema({
  scheduledDate: Date,
  executedDate: Date,
  approvedDate: Date,
  disapprovedDate: Date,
  correctedDate: Date,
  configService: { type: Schema.Types.ObjectId, ref: 'ConfigService' },
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  quantity: Number,
  description: String,
  nroViajes: Number,
  status: { type: Schema.Types.ObjectId, ref: 'ServiceStatus' },
  disapproveNotes: String
});

module.exports = mongoose.model('Service', serviceSchema);