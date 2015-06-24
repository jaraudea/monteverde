// Run service controller

'use strict';

monteverde.controller('runSvcCtrl', function ($state, $scope, $timeout, $modal, ngTableParams, AlertsFactory, connectorService, $filter, JrfService, socketFactory) {

  var contractId = null,
      dataSpecieTable = [];

// Socket IO
  socketFactory.on('notifyChanges', function (data) {
    // uptadeData(data);
  });  

  var uptadeData = function (data) {
    updateServicesTable();
    percentStatus();
    console.log('updating all data', data);
  }; 

  $scope.isEditing = false;

  $scope.tableData = [];

  $scope.controls = {};

  $scope.formData = {};

  $scope.images = {};

  $scope.vehicles = [];

  $scope.percent = 0;

  // fix date
  var tt = new Date();
  // tt.setHours(0, -tt.getTimezoneOffset(), 0, 0);
  $scope.formData.date = tt;

  $scope.formData.vehicle = '';

  $scope.codes = [];

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    language: 'es'
  };

  $scope.uploader = {
    target : "/upload",
    testChunks : true,
    controllerFn: function ($flow, $file, $message) {
      processform();
    }
  }
  
  $scope.doneQuantity = 0;

  var init = function () {
    dataGet('zones');
    dataGet('contracts');
    dataGet('teams');
    dataGet('units');
    dataGet('vehicles');
    percentStatus();
  };

  var percentStatus = function () {
    connectorService.getData(connectorService.ep.execPercent)
      .then(
        function (res) {
          $scope.percent = res.executionPercentage;
        },
        function (err) {
          console.log('error:', err);
        }
      )
  };

  var editExecution = function (id) { 

    connectorService.getData(connectorService.ep.executeServiceById, id)
      .then(
        function (res) {
          var data = JrfService.parseRunServicetableDataEditable(res[0], $scope);

          $scope.clearForm(function () {
            $scope.formData._id = data._id;
            $scope.formData.code = data.code;
            $scope.formData.vehicle = data.vehicle;
            $scope.formData.configService = data.configService;
            $scope.formData.vehicleObj = data.vehicleObj;
            $scope.formData.unit = data.unit;
            $scope.formData.team = data.team;
            $scope.formData.doneQuantity = data.quantity;
            $scope.formData.area = data.area;
            $scope.formData.tripsNumber = data.trips;
            $scope.formData.observations = data.observations;
            $scope.savedImages = data.images.concat();
            $scope.isEditing = true;
          });
          $timeout(function () {
            $scope.$apply();
            console.log('digested');
          }, 1000);
        },
        function (err) {
          console.log('error:', err);
        }
      )

  };

  $scope.editCancel = function () {
    $scope.isEditing = false;
    $scope.clearForm();
  };

  $scope.clearForm = function (callback) {
    var form = $scope.addExecSvcForm;
    $scope.formData.code = '';
    $scope.formData.team = '';
    $scope.formData.vehicle = '';
    $scope.formData.unit = '';
    $scope.formData.tripsNumber = 0;
    $scope.formData.observations = '';
    $scope.savedImages = [];

    if (typeof $scope.images.flow.cancel === 'function') {
      $scope.images.flow.cancel();
    };
    form.$setPristine();

    if (typeof callback === 'function') {
      callback();
    }
  };

  $scope.updateCodes = function () {
    var formData = $scope.formData;

    $scope.clearForm();

    if ((typeof formData.contract != 'undefined') && (typeof formData.serviceType != 'undefined') && (typeof formData.zone != 'undefined'))  {
      dataGet('codes', '?contract=' + formData.contract + '&serviceType=' + formData.serviceType + '&zone=' + formData.zone);
      updateServicesTable();
    };
  };

  var updateServicesTable = function () {
      var formData = $scope.formData;
      if (typeof formData.contract != 'undefined' 
        && typeof formData.serviceType != 'undefined' 
        && typeof formData.zone != 'undefined' 
        && typeof formData.date !== 'undefined') {
        // formData.date.setHours(0, -formData.date.getTimezoneOffset(), 0, 0);
        var date = formData.date.toISOString().substr(0, 10);

        dataGet('executeService', '?contract=' + formData.contract + '&serviceType=' + formData.serviceType + '&zone=' + formData.zone + '&date=' + date, function (data) {
          $scope.tableData = JrfService.parseRunServicetableData(data, $scope);
          $scope.tableParams.reload();
        });
      }
  };

// Image manipulaiton
  $scope.open = function(img) {
    if (typeof img.file !== 'undefined') {
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
    } else {
      var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          template: '<img width="400" class="center-block" src="/download/' + img.identifier + '" >'      
      })
    }
  };

  $scope.cancel = function (img) {
    if (typeof img.cancel === 'function') {
      img.cancel();
    } else {
      var ndx = $scope.savedImages.indexOf(img);
      $scope.savedImages.splice(ndx, 1);
    }
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

    editExecution(id);

    console.log('id: ', id);
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

      $scope.formData.configService = data;
      $scope.formData.unit = data.unit;
      $scope.formData.team = data.team;
      $scope.formData.codeId = data._id;
      $scope.formData.area = data.area;

      $scope.formData.codeId = data._id;

      $scope.calculateWork();
    });
  };

  $scope.submitaddExec = function () {
    var form = $scope.addExecSvcForm,
        valid = form.$valid,
        files = $scope.images.flow.files,
        editing = $scope.isEditing,
        savedImages = $scope.savedImages,
        data = $scope.formData;

    if (valid) {

      // add file names
      if (files.length || savedImages.length) {
        data.files = [];

        // add new images
        for (var ndx = 0; ndx < files.length; ndx++) {
          data.files.push({
            name: files[ndx].name, 
            identifier: files[ndx].uniqueIdentifier || files[ndx].identifier
          });
        };

        // if have saved images, save  
        for (var ndx = 0; ndx < savedImages.length; ndx++) {
          data.files.push({
            name: savedImages[ndx].name, 
            identifier: savedImages[ndx].uniqueIdentifier || savedImages[ndx].identifier
          });
        };
      };

      $scope.submittedData = JrfService.parseRunService(data, editing);

      if (files.length ) {
        $scope.images.flow.upload()
      } else {
        processform();
      };
      
    } else {
      AlertsFactory.addAlert('warning', 'Por favor llene todos los campos correctamente antes de agregar el servicio', true);
    }

  };

  var processform = function () {
    var data = $scope.submittedData;
    if ($scope.isEditing) {
      connectorService.editData(connectorService.ep.updateExecution, $scope.formData._id, data)
        .then(
          function (data) {
            AlertsFactory.addAlert('success', 'Servicio Actualizado', true);
            $scope.isEditing = false;
            $scope.clearForm();
            updateServicesTable();
          },
          function (err) {
            AlertsFactory.addAlert('danger', 'Error al actualizar el servicio');
            $scope.isEditing = false;
            $scope.clearForm();
          });           
    } else{
      connectorService.setData(connectorService.ep.createSrv, data)
        .then (
          function (data) {
            AlertsFactory.addAlert('success', 'Ejecucion del servicio creada', true);
            updateServicesTable();
            $scope.clearForm();
          },
          function (err) {
            AlertsFactory.addAlert('danger', 'Error al crear servicio, contacte al servicio tecnico error:' + err, true);
            $scope.clearForm();
          }
        );
    }
  };

  $scope.upload = function(){
    $scope.images.flow.upload();
  };


  $scope.clearOnServiceTypeChange = function (type) {
    $scope.serviceType = type;
  }

  $scope.calculateWork = function (param) {
    if(typeof param !== 'undefined') {
      return param.plate;
    };
    
    var formData = $scope.formData;

    if ($scope.serviceType !== '5563efda45051764c2e3da12') {
      try{
        var m3 = (typeof formData.vehicle === 'string') ? parseFloat(formData.vehicleObj.cubicMeters) : parseFloat(formData.vehicle.cubicMeters),
            trips = parseInt(formData.tripsNumber);

        $scope.formData.doneQuantity = parseFloat(trips * m3).toFixed(2);
      }catch(e){
      }
    } else {
      $scope.formData.doneQuantity = $scope.formData.configService.area;
    };
  };


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