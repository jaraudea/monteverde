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

  this.parseRunServicetableData = function (data, scope) {

    var parsedData = [];
 
    if (typeof data.length !== 'undefined') {
      for(var i = 0; i <= data.length - 1; i++ ) {
        parsedData.push({
          _id : data[i]._id,
          field: 0,
          team: scope.controls.teams.findById(data[i].team, 'code' ),
          state: 0,
          quantity: data[i].quantity,
          vehicle: scope.controls.vehicles.findById(data[i].vehicle, 'plate'),
          unit: scope.controls.units.findById(data[i].unit, 'name'),
          trips: data[i].trips,
          options: data[i].options
        });
      };
    };

    return parsedData
  };

});