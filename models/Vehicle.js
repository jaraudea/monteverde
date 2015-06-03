var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var vehicleSchema = new Schema({
  plate: String,
  cubicMeters: Number,
  driver: { type: Schema.Types.ObjectId, ref: 'Employee' },
  active: Boolean
});

module.exports = mongoose.model('Vehicle', vehicleSchema);