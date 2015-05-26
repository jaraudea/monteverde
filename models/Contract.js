var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var contractSchema = new Schema({
  contractNumber: String,
  contractDate: Date,
  endDate: Date,
  serviceType: [{ type: Schema.Types.ObjectId, ref: 'ServiceType' }], //revisar 
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
  }
});

module.exports = mongoose.model('Contract', contractSchema);