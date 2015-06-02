var mongoose = require('mongoose')
  Schema = mongoose.Schema;

var rolSchema = new Schema({
	name: String,
	active: Boolean
}, {collection: 'roles'});

module.exports = mongoose.model('Rol', rolSchema);