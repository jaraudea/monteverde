require('./Employee')

var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var teamSchema = new Schema({
  code: String,
  name: String,
  lider: { type: Schema.Types.ObjectId, ref: 'Employee' }
});

module.exports = mongoose.model('Team', teamSchema);