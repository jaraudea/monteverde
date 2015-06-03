// create service controller
'use strict';

monteverde.controller('createSvcCtrl', function ($state, $scope, AlertsFactory, connectorService) {
  var contractId = null;

  $scope.controls = {
    zones : [],
    unities : [],
    serviceTypes : [],
    contracts : [],
    teams : [],
    units : []
  };

  $scope.formData = {};
    
  this.submitcreateSvc = function () {
    var data = $scope.formData,
        contract = data.mContract.split(':')[1],
        code = data.code;

        delete data.mContract;
        data.contract = contract;


    connectorService.setData(connectorService.ep.create, data)
      .then(function (data) {
        AlertsFactory.addAlert('success', 'Servicio creado, contrato: ' + code);
      });
  }

  $scope.updateContractType = function (ndx) {
    var servicesNdx = ndx.split(':')[0];
    contractId = ndx.split(':')[1],

    $scope.controls.serviceTypes = $scope.controls.contracts[servicesNdx].serviceType;
  }

  var init = function () {
    getZones();
    getContracts();
    getTeams();
    getUnits();
  }

  // get zones
  var getZones = function () {
    connectorService.getData(connectorService.ep.zones)
      .then(function (data) {
        $scope.controls.zones = data;
      });    
  };

  // get serviceTypes
  var getServiceTypes = function () {
    connectorService.getData(connectorService.ep.serviceTypes)
      .then(function (data) {
        $scope.controls.serviceTypes = data;
      });    
  };

  // get contracts
  var getContracts = function () {
    connectorService.getData(connectorService.ep.contracts)
      .then(function (data) {
        $scope.controls.contracts = data;
      });    
  };

  // get teams
  var getTeams = function () {
    connectorService.getData(connectorService.ep.teams)
      .then(function (data) {
        $scope.controls.teams = data;
      });    
  };

  // get units
  var getUnits = function () {
    connectorService.getData(connectorService.ep.units)
      .then(function (data) {
        $scope.controls.units = data;
      });    
  };

  init();
});