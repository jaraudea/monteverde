var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var taskSchema = new Schema({
  name: String,
  active: Boolean
});

module.exports = mongoose.model('Task', taskSchema);