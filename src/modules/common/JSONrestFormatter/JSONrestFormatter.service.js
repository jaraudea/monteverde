// JSON rest formatter service
'use strict';

common.service ('JrfService', function () {
  this.parseRunService = function (data) {
    var parsedData = {
      contract: data.contract, 
      serviceType: data.serviceType, 
      zone: data.zone, 
      date: data.date.getFullYear() + '-' + data.date.getMonth() + '-' + data.date.getDate(), 
      configService: data.codeId || _id, 
      team: data.team, 
      quantity: data.doneQuantity, 
      unit: data.unit, 
      vehicle: data.vehicle._id, 
      trips: data.tripsNumber, 
      description: data.observations, 
      photos: data.files
    }

    return parsedData
  };


});