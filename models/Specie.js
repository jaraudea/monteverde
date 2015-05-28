var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var specieSchema = new Schema({
  name: String,
  active: Boolean
});

module.exports = mongoose.model('Specie', specieSchema);