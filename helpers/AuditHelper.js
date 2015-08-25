var Audit = require('../models/Audit')

//TODO move to constants
exports.APPROVED_TYPE = '55c96cf6905e1eb799be24f8'
exports.CORRECTED_TYPE = '55c96d12905e1eb799be24fa'
exports.CREATED_TYPE = '55c9718d905e1eb799be24ff'
exports.DISAPPROVED_TYPE = '55c96d1a905e1eb799be24fb'
exports.EXECUTED_TYPE = '55c96cfd905e1eb799be24f9'
exports.MODIFIED_TYPE = '55c96d2c905e1eb799be24fc'
exports.SCHEDULED_TYPE = '55c96d3f905e1eb799be24fd'
exports.REMOVED_TYPE = '55c97df5905e1eb799be2500'

var populateAudit = function(type, userId, entity) {
  var audit = {
    type: type,
    user: userId,
    entity: entity,
    date: new Date()
  }
  return audit
}
exports.createAudit = function(auditType, userId, entityId, callback) {
  var audit = populateAudit(auditType, userId, entityId)
  Audit.create(audit, function(err) {
    if (err) callback(err)
    callback()
  })
}

exports.populateAudit = function(service, callback) {
  Audit.find({entity: service._id})
      .populate('user')
      .exec(function(err, audits) {
        if(err) callback(err)
        audits.forEach(function(audit) {
          if(audit.type == "55c96d3f905e1eb799be24fd") {
            service['_doc']['schedulerUser'] = audit.user.name
          } else if(audit.type == "55c96cfd905e1eb799be24f9") {
            service['_doc']['executerUser'] = audit.user.name
          } else if(audit.type == "55c96cf6905e1eb799be24f8") {
            service['_doc']['approverUser'] = audit.user.name
          } else if(audit.type == "55c96d1a905e1eb799be24fb") {
            service['_doc']['disapproverUser'] = audit.user.name
          } else if(audit.type == "55c96d12905e1eb799be24fa") {
            service['_doc']['correctorUser'] = audit.user.name
          }
        })
        callback(null,service)
  })
}
