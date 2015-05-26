var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var specieSchema = new Schema({
  name: String,
  active: Boolean
});

module.exports = mongoose.model('Specie', specieSchema);