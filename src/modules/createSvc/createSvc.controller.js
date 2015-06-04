// create service controller
'use strict';

monteverde.controller('createSvcCtrl', function ($state, $scope, ngTableParams, AlertsFactory, connectorService) {
  var contractId = null,
      dataSpecieTable = [];

  $scope.controls = {};

  $scope.formData = {};
    
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
    
  $scope.SetupEspecie = function (specie, data) {
    data = data.split(':');
    specie._id = data[0];
    specie.name = data[1];
    console.log('specie:', dataSpecieTable);
  }

  $scope.removeSpecie = function (ndx) {
    if (ndx > -1) {
      dataSpecieTable.splice(ndx, 1);
    };

    $scope.tableParams.reload();
  }

  this.submitcreateSvc = function () {
    var data = $scope.formData,
        contract = data.mContract.split(':')[1],

        code = data.code;

        delete data.mContract;
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

  $scope.updateContractType = function (ndx) {
    var servicesNdx = ndx.split(':')[0];
    contractId = ndx.split(':')[1],

    $scope.controls.serviceTypes = $scope.controls.contracts[servicesNdx].serviceType;
  }

  var init = function () {
    dataGet('zones');
    dataGet('contracts');
    dataGet('teams');
    dataGet('units');
    dataGet('species');
    dataGet('tasks');
    dataGet('envAuths');
  }

  // Method to GET data
  var dataGet = function (type) {
    connectorService.getData(connectorService.ep[type])
      .then(function (data) {
        $scope.controls[type] = data;
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