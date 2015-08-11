require('./ServiceType')
require('./Zone')

var mongoose = require('../data/db'),
  Schema = mongoose.Schema;

var contractSchema = new Schema({
  contractNumber: String,
  contractDate: Date,
  endDate: Date,
  serviceType: [{ type: Schema.Types.ObjectId, ref: 'ServiceType' }],
  client: { 
    nit: String,
    companyName: String,
    city: String,
    phone: String,
    fax: String,
    contacts: [{ 
      name: String,
      phone: String,
      position: String,
      email: String
    }]
  },
  zones: [{ type: Schema.Types.ObjectId, ref: 'Zone' }]
});

module.exports = mongoose.model('Contract', contractSchema);