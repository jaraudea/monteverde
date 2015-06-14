// Factory to manage the alerts
'use strict';

common.factory('AlertsFactory', function ($rootScope, $timeout) {
  var factory = {};

  $rootScope.alerts = [];

  factory.addAlert = function(type, msg, disposable) {
    $rootScope.alerts.push({type: type, msg: msg});
  };

  factory.closeAlert = function(index, alert) {
    alert.alert.destroy = "opacity : 0";
    $timeout (function () {
      $rootScope.alerts.splice(index, 1);
    }, 500);
  }; 

  $rootScope.addAlert = factory.addAlert;

  $rootScope.closeAlert = factory.closeAlert;

  return factory;
});