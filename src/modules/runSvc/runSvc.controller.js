// Run service controller

'use strict';

monteverde.controller('runSvcCtrl', function ($state, $scope, $modal, ngTableParams, AlertsFactory, connectorService, $filter) {

  var contractId = null,
      dataSpecieTable = [];

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

  var init = function () {
    dataGet('zones');
    dataGet('contracts');
    dataGet('teams');
    dataGet('units');
    dataGet('vehicles', '', function (data) {
        $scope.vehicles = data;
    });

    dataGet('codes', '', function (data) {
      for (var ndx in data) {
        $scope.codes.push(data[ndx].code);
      };
    });

  }

  $scope.upload = function(){
    $scope.images.flow.upload();
  };

  $scope.getServiceConfig = function (_id) {
    dataGet('serviceConf', _id, function (data) {
      var data = data[0];

      $scope.formData = data;

      $scope.tableParams.reload();

      updateWorkArea(data);
    });
  };

  var updateWorkArea = function (data) {
    var formData = $scope.formData;
    try{
      $scope.doneQuantity = (typeof data.area !== 'undefined') ? data.area : (parseInt(formData.vehicle.cubicMeters) * parseInt(formData.tripsNumber));
    }catch(e){
    }
  }

  $scope.calculateWork = function () {
    var formData = $scope.formData;

    if (typeof formData.area === 'undefined') {
      try{
        $scope.doneQuantity = parseInt(formData.vehicle.cubicMeters) * parseInt(formData.tripsNumber);
      }catch(e){
      }
    };
  };

  this.submitaddExec = function () {
    var form = $scope.addExecSvcForm,
        valid = form.$valid,
        files = $scope.images.flow.files,
        data = $scope.formData;

    if (valid) {

      // add file names
      if (files.length) {
        data.files = [];

        for (var ndx in files) {
          data.files.push(files[ndx].name);
        };

        $scope.images.flow.upload();
      }

      console.log('data:', data);

      connectorService.setData(connectorService.ep.createSrv, data)
        .then (
          function (data) {
            console.log('saved!');
          },
          function (err) {
            console.log('error!', err);
          }
        );
    } else {
      AlertsFactory.addAlert('warning', 'Por favor llene todos los campos correctamente antes de agregar el servicio', true);
    }

  };

  var data = [
      {field: "Moroni", team: 50, state: 1, options: 1},
      {field: "Tiancum", team: 43, state: 1, options: 1}
  ];


  $scope.percent = 25;

  $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10           // count per page
  }, {
      total: data.length, // length of data
      getData: function($defer, params) {
          // use build-in angular filter
          var orderedData = params.sorting() ?
                  $filter('orderBy')(data, params.orderBy()) :
                  data;

          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
   });

  init();
});