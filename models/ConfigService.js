var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var configSvcSchema = new Schema({
  code: String,
  contract: { type: Schema.Types.ObjectId, ref: 'Contract' },
  serviceType: { type: Schema.Types.ObjectId, ref: 'ServiceType' },
  zone: { type: Schema.Types.ObjectId, ref: 'Zone' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
  location: String,
  period: Number,
  area: Number,
  envAuthority: { type: Schema.Types.ObjectId, ref: 'EnvironmentalAuthority'},
  description: String,
  active: Boolean,
  treeSpeciesByTask: [{
    specie: { type: Schema.Types.ObjectId, ref: 'Specie' },
    task:  { type: Schema.Types.ObjectId, ref: 'Task' },
    quantity: Number
  }]
});

module.exports = mongoose.model('ConfigService', configSvcSchema);