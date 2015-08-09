// create service controller
'use strict';

monteverde.controller('createSvcCtrl', function ($state, $scope, ngTableParams, AlertsFactory, connectorService) {
  var contractId = null,
      dataSpecieTable = [];

  $scope.controls = {};

  $scope.formData = {};

  $scope.codes = [];

  $scope.addSpecie = function () {
    dataSpecieTable.push(
      {
        specie : {
          _id : '', 
          name : ''
        }, 
        task : {
          _id : '', 
          name : ''
        }, 
        quantity : 1, 
        edit: true
      }
    );
    $scope.tableParams.reload();
  }

  $scope.removeSpecie = function (ndx) {
    if (ndx > -1) {
      dataSpecieTable.splice(ndx, 1);
    };

    $scope.tableParams.reload();
  }

  this.submitcreateSvc = function () {
    var data = $scope.formData,
        code = data.code,
        editing = $scope.codes.indexOf(code) > -1;

        // add species and tasks
        if (data.serviceType === '5563efe645051764c2e3da13') {
          for(ndx in dataSpecieTable) {
            delete dataSpecieTable[ndx].edit
          }

          data.treeSpeciesByTask = dataSpecieTable;
        };

    // Check if is editting or creating
    if (!editing) {
    connectorService.setData(connectorService.ep.create, data)
      .then(
        function (data) {
          AlertsFactory.addAlert('success', 'Servicio creado, codigo: ' + code, true);
          $state.go($state.current, {}, {reload: true});
        },
        function (err) {
          AlertsFactory.addAlert('danger', 'Error al crear el servicio: ' + code, true);
        });
    } else {
      connectorService.editData(connectorService.ep.create, code, data)
        .then(
          function (data) {
            AlertsFactory.addAlert('success', 'Servicio Actualizado, codigo: ' + code, true);
            $state.go($state.current, {}, {reload: true});
          },
          function (err) {
            AlertsFactory.addAlert('danger', 'Error al crear el servicio: ' + code, true);
          });      
    }
  }

  $scope.getServiceConfig = function (_id) {
    if (areAllFiltersSet()) {
      dataGet('serviceConf', "?code="+_id+"&contract="+$scope.formData.contract+"&serviceType="+$scope.formData.serviceType+"&zone="+$scope.formData.zone, function (data) {
        $scope.formData = data[0];
        dataSpecieTable = data[0].treeSpeciesByTask;
        $scope.tableParams.reload();
      });
    }
  };

  var init = function () {
    dataGet('zones');
    dataGet('contracts');
    dataGet('teams');
    dataGet('units');
    dataGet('species');
    dataGet('tasks');
    dataGet('envAuths');
  }

  $scope.loadCodes = function() {
    $scope.codes=[];
    if (areAllFiltersSet()) {
      clearCodeField();
      var formData = $scope.formData
      dataGet('codes', '?contract=' + formData.contract + '&serviceType=' + formData.serviceType + '&zone=' + formData.zone, function (data) {
        for (var ndx in data) {
          $scope.codes.push(data[ndx].code);
        };
      });
    }
  }

  var areAllFiltersSet = function() {
    var formData = $scope.formData;
    return typeof formData.contract !== 'undefined' && formData.contract != null
        && typeof formData.serviceType !== 'undefined' && formData.serviceType != null
        && typeof formData.zone !== 'undefined' && formData.zone != null
  }

  var clearCodeField = function() {
    $scope.formData.code = undefined
  }

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

  // Eviroment authority table
  $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      total: 1,
      count: 500           // count per page
  }, {
      total: dataSpecieTable.length, // length of dataSpecieTable
      getData: function ($defer, params) {
          $defer.resolve(dataSpecieTable.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      },
      $scope : $scope
  })

  $scope.reset = function() {
    contractId = null;
    dataSpecieTable = [];

    $scope.controls = {};

    $scope.formData = {};

    $scope.codes = [];
    
  };

  $scope.reset();

  init();
});