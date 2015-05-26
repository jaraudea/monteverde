var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var employeeSchema = new Schema({
  id: String,
  name: String,
  phone: String,
  email: String,
  position: String,
  startDate: Date
});

module.exports = mongoose.model('Employee', employeeSchema);