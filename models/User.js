var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String,
  name: String,
  rol: { type: Schema.Types.ObjectId, ref: 'Rol' }
}, {collection: 'users'});

module.exports = mongoose.model('User', userSchema);