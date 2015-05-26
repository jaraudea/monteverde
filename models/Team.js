var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var teamSchema = new Schema({
  code: String,
  lider: { type: Schema.Types.ObjectId, ref: 'Employee' }
});

module.exports = mongoose.model('Team', teamSchema);