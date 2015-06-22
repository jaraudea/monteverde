// JSON rest formatter service
'use strict';

common.service ('JrfService', function () { 
  this.parseRunService = function (data) {
    var parsedData = {
      contract: data.contract, 
      serviceType: data.serviceType, 
      zone: data.zone, 
      date: data.date.toJSON().substr(0, 10), 
      configService: data.codeId || _id, 
      team: data.team, 
      quantity: data.doneQuantity, 
      unit: data.unit, 
      vehicle: data.vehicle._id, 
      trips: data.tripsNumber, 
      description: data.observations,
      photos: []
    }

    data.files.forEach(function(photo) {
      var photoJson = {
        name: photo.name, 
        identifier: photo.identifier
      };
      parsedData.photos.push(photoJson);
    });

    return parsedData
  };

  this.parseRunServicetableData = function (data, scope) {

    var parsedData = [];
 
    if (typeof data.length !== 'undefined') {
      for(var i = 0; i <= data.length - 1; i++ ) {
        parsedData.push({
          _id : data[i]._id,
          field: data[i].configService.code,
          team: scope.controls.teams.findById(data[i].team, 'code' ),
          state: data[i].state,
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

  this.parseRunServicetableDataEditable = function (data, scope) {

    var parsedData = [];
 
    if (typeof data.length !== 'undefined') {
      for(var i = 0; i <= data.length - 1; i++ ) {
        parsedData.push({
          vehicle : scope.controls.vehicles.findById(data[i].vehicle, 'plate'),
          serviceType : data[i].serviceType,
          observations : data[i].description,
          unit : data[i].unit,
          team : data[i].team,
          trips : data[i].trips,
          images : data[i].photos,
          code: data[i].configService.code 
        });
      };
    };

    return parsedData
  };

});