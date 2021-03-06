// JSON rest formatter service
'use strict';

common.service ('JrfService', function () {
  this.parseRunService = function (data, editing) {
    var parsedData = {
      configService : data.configService,
      contract: data.contract, 
      serviceType: data.serviceType, 
      zone: data.zone, 
      date: data.date,
      team: data.team, 
      quantity: data.doneQuantity, 
      unit: data.unit,
      vehicle: (typeof data.vehicle === 'object')? data.vehicle : data.vehicleObj,
      trips: data.tripsNumber,
      description: data.observations,
      photos: []
    };

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
          configService : data[i].configService,
          field: (data[i].configService !== null && typeof data[i].configService !== 'undefined') ? data[i].configService.code : "",
          team: data[i].team.code,
          status: data[i].status.name,
          quantity: data[i].quantity,
          vehicle: (data[i].vehicle !== null && typeof data[i].vehicle !== 'undefined') ? data[i].vehicle.plate : "",
          unit: (data[i].unit !== null && typeof data[i].unit !== 'undefined') ? data[i].unit.name : "",
          trips: data[i].trips,
          options: data[i].options
        });
      };
    };

    return parsedData
  };

  this.parseRunServicetableDataEditable = function (data, scope) {

    var parsedData = {};
 
    if (typeof data !== 'undefined') {
      parsedData = {
        _id : data._id,
        configService : data.configService,
        contract: data.contract,
        vehicle : (typeof data.vehicle !== 'undefined') ? data.vehicle.plate : undefined,
        vehicleObj : (typeof data.vehicle !== 'undefined') ? data.vehicle : undefined,
        serviceType : data.serviceType.name,
        observations : data.description,
        unit : data.unit._id,
        area : data.area,
        team : data.team._id,
        status : data.status.name,
        quantity : data.quantity,
        trips : data.trips,
        zone : data.zone,
        images : data.photos,
        code: data.configService.code 
      };
    };

    return parsedData
  };

  this.parseScheduleService = function(data) {
    var parsedData = {
      configService : data.configService._id,
      contract: data.contract,
      serviceType : data.serviceType,
      team : data.team,
      zone : data.zone,
      quantity: data.configService.area,
      unit: data.configService.unit,
      date: data.date
    };

    return parsedData;
  };

});