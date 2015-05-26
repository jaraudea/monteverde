var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var svcConfigSchema = new Schema({
  code: String,
  contract: { type: Schema.Types.ObjectId, ref: 'Contract' },
  serviceType: { type: Schema.Types.ObjectId, ref: 'ServiceType' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  envAuthority: { type: Schema.Types.ObjectId, ref: 'EnvironmentalAuthority'}
  description: String,
  active: Boolean,
  treeSpeciesByTask [{
    specie: { type: Schema.Types.ObjectId, ref: 'Specie' },
    task:  { type: Schema.Types.ObjectId, ref: 'Task' },
    quantity: Number
  }]
});

module.exports = mongoose.model('ServiceConfig', svcConfigSchema);