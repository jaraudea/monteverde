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
        kind : {
          _id : '', 
          name : 't'
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
    var data = $scope.formData

        code = data.code;

        data.contract = contract;

        // add species and tasks
        
        for(ndx in dataSpecieTable) {
          delete dataSpecieTable[ndx].edit
        }

        data.treeSpeciesByTask = dataSpecieTable;

    connectorService.setData(connectorService.ep.create, data)
      .then(
        function (data) {
          AlertsFactory.addAlert('success', 'Servicio creado, contrato: ' + code);
          $state.go($state.current, {}, {reload: true});
        },
        function (err) {
          AlertsFactory.addAlert('danger', 'Error al crear el servicio: ' + code);
        });
  }

  $scope.getServiceConfig = function (_id) {
    dataGet('serviceConf', _id, function (data) {
      console.log(_id, data);
      $scope.formData = data[0];
      dataSpecieTable = data[0].treeSpeciesByTask;
      $scope.tableParams.reload();
    });
  };

  var init = function () {
    dataGet('zones');
    dataGet('contracts');
    dataGet('teams');
    dataGet('units');
    dataGet('species');
    dataGet('tasks');
    dataGet('envAuths');
    dataGet('codes', '', function (data) {
      for (var ndx in data) {
        $scope.codes.push(data[ndx].code);
      };
    });
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


  init();
});