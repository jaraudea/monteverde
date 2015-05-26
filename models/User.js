var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String,
  name: String
  rol: { type: Schema.Types.ObjectId, ref: 'Rol' }
});

module.exports = mongoose.model('User', userShema);