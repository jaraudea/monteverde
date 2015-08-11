require('./CompanyPosition')

var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var employeeSchema = new Schema({
  personalId: String,
  name: String,
  phone: String,
  email: String,
  position: { type: Schema.Types.ObjectId, ref: 'CompanyPosition' },
  startDate: Date
});

module.exports = mongoose.model('Employee', employeeSchema);