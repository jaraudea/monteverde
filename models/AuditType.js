var mongoose = require('mongoose')
  Schema = mongoose.Schema;

var auditTypeSchema = new Schema({
	name: String,
	active: Boolean
}, {collection: 'audittypes'});

module.exports = mongoose.model('AuditType', auditTypeSchema);