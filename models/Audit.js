require('./AuditType')
require('./User')

var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var auditSchema = new Schema({
  entity: Schema.Types.ObjectId,
  date: Date,
  type: {type: Schema.Types.ObjectId, ref: 'AuditType'},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Audit', auditSchema);