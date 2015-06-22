// Run service controller

'use strict';

monteverde.controller('runSvcCtrl', function ($state, $scope, $modal, ngTableParams, AlertsFactory, connectorService, $filter, JrfService, socketFactory) {

  var contractId = null,
      dataSpecieTable = [];

// Socket IO
  socketFactory.on('notifyChanges', function (data) {
    uptadeData(data);
  });  

  var uptadeData = function (data) {
    updateServicesTable();
    console.log('updating all data', data);
  }; 


  var editExecution = function (data) {
    // TODO: proces the data to edit in the botton area
    console.log('data:', data);
  };

  $scope.tableData = [];

  $scope.controls = {};

  $scope.formData = {};

  $scope.images = {};

  $scope.vehicles = [];

  $scope.formData.vehicle = '';

  $scope.codes = [];

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    language: 'es'
  };

  $scope.uploader = {
    target : "/upload",
    testChunks : true
  }
  
  $scope.doneQuantity = 0;

  var init = function () {
    dataGet('zones');
    dataGet('contracts');
    dataGet('teams');
    dataGet('units');
    dataGet('vehicles');
  };

  $scope.updateCodes = function () {
    var formData = $scope.formData;
    
    if ((typeof formData.contract != 'undefined') && (typeof formData.serviceType != 'undefined') && (typeof formData.zone != 'undefined'))  {
      dataGet('codes', '?contract=' + formData.contract + '&serviceType=' + formData.serviceType + '&zone=' + formData.zone);
        updateServicesTable();
    };
  };

  var updateServicesTable = function () {
      var formData = $scope.formData;
      if (typeof formData.date !== 'undefined') {
        var date = formData.date.toJSON().substr(0, 10);

        dataGet('executeService', '?contract=' + formData.contract + '&serviceType=' + formData.serviceType + '&zone=' + formData.zone + '&date=' + date, function (data) {
          $scope.tableData = JrfService.parseRunServicetableData(data, $scope);
          $scope.tableParams.reload();
        });
      }
  };

  $scope.open = function(img) {
    var base64;
    var fileReader = new FileReader();
      fileReader.onload = function (event) {
            base64 = event.target.result;

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                template: '<img width="400" class="center-block" src="' + base64 + '" >'
            })
        };

    fileReader.readAsDataURL(img.file);    
  };

  // Method to GET data
  var dataGet = function (type, param, callback) {
    var url = (typeof param !== 'undefined') ? connectorService.ep[type] + param : connectorService.ep[type];
    connectorService.getData(url)
      .then(function (data) {
        if (typeof callback === 'function'){
          callback(data);
        } else {
          $scope.controls[type] = data;
        };
      });    
  }

  $scope.editExecution = function (ndx) {
    var id = $scope.tableData[ndx]._id;

    connectorService.getData(connectorService.ep.serviceConf, id)
      .then(
        function (data) {
          editExecution(data);
        },
        function (err) {
          AlertsFactory.addAlert('danger', 'Error al editar el servicio, contacte al servicio tecnico error:' + err, true);
        }
      )

  };

  $scope.removeExecution = function (ndx, id) {
    connectorService.removeData(connectorService.ep.deleteSrv, id)
      .then(
        function (data) {
          AlertsFactory.addAlert('warning', 'Ejecucion del servicio eliminada', true);
          updateServicesTable();
        },
        function (err) {
          AlertsFactory.addAlert('danger', 'Error al eliminar servicio, contacte al servicio tecnico error:' + err, true);
        }
      )
  }

  $scope.getServiceConfig = function (_id) {
    dataGet('serviceConf', _id, function (data) {
      var data = data[0];

      $scope.formData.unit = data.unit;
      $scope.formData.team = data.team;
      $scope.formData.codeId = data._id;

      $scope.formData.codeId = data._id;


      updateWorkArea(data);
    });
  };

  $scope.submitaddExec = function () {
    var form = $scope.addExecSvcForm,
        valid = form.$valid,
        files = $scope.images.flow.files,
        data = $scope.formData;

    console.log('data:', $scope.formData);

    if (valid) {

      // add file names
      if (files.length) {
        data.files = [];

        for (var ndx = 0; ndx < files.length; ndx++) {
          data.files.push({name: files[ndx].name, identifier: files[ndx].uniqueIdentifier});
        };
        console.log(data.files);
        $scope.images.flow.upload();
      }

      data = JrfService.parseRunService(data);

      connectorService.setData(connectorService.ep.createSrv, data)
        .then (
          function (data) {
            AlertsFactory.addAlert('success', 'Ejecucion del servicio creada', true);
            updateServicesTable();
            // $state.go($state.current, {}, {reload: true});
          },
          function (err) {
            AlertsFactory.addAlert('danger', 'Error al crear servicio, contacte al servicio tecnico error:' + err, true);
          }
        );
    } else {
      AlertsFactory.addAlert('warning', 'Por favor llene todos los campos correctamente antes de agregar el servicio', true);
    }

  };

  $scope.upload = function(){
    $scope.images.flow.upload();
  };


  $scope.clearOnServiceTypeChange = function () {
    $scope.formData.code = "";
  }

  var updateWorkArea = function (data) {
    var formData = $scope.formData;
    try{
      $scope.formData.doneQuantity = (typeof data.area !== 'undefined') ? data.area : (parseInt(formData.vehicle.cubicMeters) * parseInt(formData.tripsNumber));
    }catch(e){}
  }

  $scope.calculateWork = function (param) {
    if(typeof param !== 'undefined') {
      return param.plate;
    };
    
    var formData = $scope.formData;

    if (typeof formData.area !== 'undefined') {
      try{
        $scope.formData.doneQuantity = parseInt(formData.vehicle.cubicMeters) * parseInt(formData.tripsNumber);
      }catch(e){
      }
    };
  };


  $scope.percent = 25;

  $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10           // count per page
  }, {
      total: $scope.tableData.length, // length of data
      getData: function($defer, params) {
          // use build-in angular filter
          var orderedData = params.sorting() ?
                  $filter('orderBy')($scope.tableData, params.orderBy()) :
                  tableData;

          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
   });

  init();
});