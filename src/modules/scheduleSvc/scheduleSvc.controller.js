'use strict';

monteverde.controller('scheduleSvcCtrl', function ($state, $scope, $filter, $modal, ngTableParams, AlertsFactory, connectorService, socketFactory, JrfService, dateTimeHelper) {

  $scope.formData = {};

  $scope.controls = {};

  $scope.tableData = [];

  $scope.formData.date = dateTimeHelper.truncateDateTime(new Date());

  $scope.percent = "";

  // Socket IO
  socketFactory.on('notifyChanges', function (data) {
    uptadeData(data);
  });

  var uptadeData = function (data) {
    updateServicesTable();
  }; 

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
    form.$setPristine();

    if (typeof callback === 'function') {
      callback();
    }
  };

  $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,           // count per page
      sorting: {
        "configService.code": 'asc'
      }
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

  $scope.duplicateService = {};

  $scope.submitaddSched = function () {
    var form = $scope.addSchedSvcForm,
        data = $scope.formData; 
    if (form.$valid) {
	    var schdSvc = dateTimeHelper.truncateDateTime(data.date)
      dataGet('serviceInMonth', '?configService=' + data.configService._id + '&date=' + schdSvc, function(service) {
        if (service) {
          $scope.duplicateService = service;
          if(service.status == '556fcda1540893b44a2aef08') { 
            $scope.modalInstance = $modal.open({
              animation: true,
              templateUrl: 'existingScheduledServiceModal',
              scope: $scope,
              size: 100
            });
          } else {
            $scope.modalInstance = $modal.open({
              animation: true,
              templateUrl: 'existingServiceModal',
              scope: $scope,
              size: 100
            });
          }
        } else {
          $scope.scheduleService();
        }
      });
    } else {
      AlertsFactory.addAlert('warning', 'Por favor llene todos los campos correctamente antes de programar el servicio', true); 
    }
  };

  $scope.scheduleService = function() {
    if (typeof $scope.modalInstance !== 'undefined') {
      $scope.modalInstance.dismiss('confirm');
    }
    var data = $scope.formData;
    $scope.submittedData = JrfService.parseScheduleService(data);
    processform();
  };

  var processform = function () {
    var data = $scope.submittedData;
    connectorService.setData(connectorService.ep.scheduleSrv, data)
      .then (
        function (data) {
          AlertsFactory.addAlert('success', 'Servicio programado', true);
          updateServicesTable();
          $scope.clearForm();
        },
        function (err) {
          AlertsFactory.addAlert('danger', 'Error al programar servicio, contacte al servicio tecnico: error:' + err, true);
          $scope.clearForm();
        }
    );
  };

  var updateServicesTable = function () {
      var formData = $scope.formData;
      if (areAllFiltersSet()) {
	      var schdSvc = dateTimeHelper.truncateDateTime(formData.date)
        dataGet('getScheduledServices', '?contract=' + formData.contract + '&serviceType=' + formData.serviceType + '&zone=' + formData.zone + '&date=' + schdSvc, function (data) {
          $scope.tableData = data;
          $scope.tableParams.reload();
          $scope.tableParams.$params.page = 1;
        });
      }
  };

  $scope.getServiceConfig = function (_id) {
    dataGet('serviceConf', "?code="+_id+"&contract="+$scope.formData.contract+"&serviceType="+$scope.formData.serviceType+"&zone="+$scope.formData.zone, function (data) {
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

  $scope.cancelServiceScheduling = function() {
    $scope.modalInstance.dismiss('cancel');
    $scope.clearForm();
  };

  $scope.closeExistingServiceModal = function() {
    $scope.modalInstance.dismiss('close');
    $scope.clearForm();
  }

  init();
});
