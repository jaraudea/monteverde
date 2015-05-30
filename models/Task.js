var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var taskSchema = new Schema({
  name: String,
  active: Boolean
});

module.exports = mongoose.model('Task', taskSchema);