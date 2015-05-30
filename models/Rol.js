var mongoose = require('mongoose')
  Schema = mongoose.Schema;

var rolSchema = new Schema({
	name: String,
	active: Boolean
});

module.exports = mongoose.model('Rol', rolSchema);