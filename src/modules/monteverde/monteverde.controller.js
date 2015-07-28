// main controller
'use strict';

monteverde.controller('monteverdeCtrl', function ($scope, $auth, $location, connectorService, socketFactory, AlertsFactory) {


  $scope.scheduledSvcsWoExec = [];

  $scope.scheduledSvcsWoApp = [];

  $scope.oldDisapprovedSvcs = [];

  // Socket IO
  socketFactory.on('notifyChanges', function (data) {
    // showServicesAlert();
  });

  $scope.$watch(function () {
      return $auth.isAuthenticated()
    }, 
    function() {
      $scope.userLogged = $auth.isAuthenticated();
      $scope.user = $auth.getPayload();
    }
  );

  $scope.logout = $auth.logout; 

  var showServicesAlert = function() {
    AlertsFactory.closeAllAlerts();
    dataGet('scheduledSvcsWoExecution', '', function(services) {
      var data = convertServicesToAlertInfo(services);
      if (data.length > 0) {
        AlertsFactory.addAlert('warning', 'Los siguientes servicios "Programados" aun no han sido ejecutados:\n' + data.join(", "));  
      }
    });
    dataGet('scheduledSvcsWoApprobation', '', function(services) {
      var data = convertServicesToAlertInfo(services);
      if (data.length > 0) {
        AlertsFactory.addAlert('danger', 'Los siguientes servicios "Programados" y "Ejecutados" aun no han sido aprobados:\n' + data.join(", "));  
      }
    });
    dataGet('oldDisapprovedSvcs', '', function(services) {
      var data = convertServicesToAlertInfo(services);
      if (data.length > 0) {
        AlertsFactory.addAlert('danger', 'Los siguientes servicios "En Corrección" y aun no han sido corregidos:\n' + data.join(", "));  
      }
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

  var convertServicesToAlertInfo = function(services) {
    var data = [];
    for (i=0; i < services.length; i++) {
      var svc = services[i];
      var dateStr = (typeof svc.scheduledDate !== 'undefined') && svc.scheduledDate !== null ? svc.scheduledDate.substr(0,10) : "";
      data.push(svc.configService.code + ': ' + dateStr);
    }
    return data;
  }

	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	};

  var init = function () {
    showServicesAlert();
  };

  init();

});
