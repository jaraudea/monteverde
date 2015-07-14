'use strict';

monteverde.controller('scheduleSvcCtrl', function ($state, $scope, $filter, ngTableParams, AlertsFactory, connectorService) {

  $scope.formData = {};

  $scope.controls = {};

  $scope.tableData = [];

  $scope.formData.date = new Date();

  var areAllFiltersSet = function() {
    var formData = $scope.formData;
    return (typeof formData.contract != 'undefined') && (formData.contract != null)
      && (typeof formData.serviceType != 'undefined') && (formData.serviceType != null)
      && (typeof formData.zone != 'undefined') && (formData.zone != null)
      && (typeof formData.date != 'undefined') && (formData.date != null);
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

  var init = function () {
    dataGet('contracts');
    dataGet('teams');
  };

  $scope.clearForm = function (callback) {
    var form = $scope.addSchedSvcForm;
    $scope.formData.code = '';
    $scope.formData.team = '';

    if (typeof callback === 'function') {
      callback();
    }
  };

  $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,           // count per page
      // sorting: {
      //   "configService.code": 'asc'
      // }
  }, {
      total: $scope.tableData.length, // length of data
      getData: function($defer, params) {
          // use build-in angular filter
          var orderedData = params.sorting() ?
                  $filter('orderBy')($scope.tableData, params.orderBy()) :
                  tableData;
          params.total(orderedData.length); // set total for recalc pagination
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
   });

  $scope.updateConfigServiceCodes = function () {
    var formData = $scope.formData;

    $scope.clearForm();

    if (areAllFiltersSet())  {
      dataGet('codes', '?contract=' + formData.contract + '&serviceType=' + formData.serviceType + '&zone=' + formData.zone);
      updateServicesTable();
    };
  };

  $scope.submitaddSched = function () {
  };

  var updateServicesTable = function () {
      var formData = $scope.formData;
      if (areAllFiltersSet()) {
        dataGet('executeService', '?contract=' + formData.contract + '&serviceType=' + formData.serviceType + '&zone=' + formData.zone + '&date=' + formData.date, function (data) {
          console.log(data);
          $scope.tableData = data;
          $scope.tableParams.reload();
          $scope.tableParams.$params.page = 1;
        });
      }
  };

  $scope.getServiceConfig = function (_id) {
    dataGet('serviceConf', _id, function (data) {
      var data = data[0];

      $scope.formData.configService = data;
      $scope.formData.unit = data.unit;
      $scope.formData.team = data.team;
      $scope.formData.codeId = data._id;
    });
  };

  $scope.removeScheduling = function (id) {
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

  init();
});
