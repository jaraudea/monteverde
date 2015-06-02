// Factory to manage the alerts
'use strict';

common.factory('AlertsFactory', function ($rootScope) {
  var factory = {};

  $rootScope.alerts = [];

  factory.addAlert = function(type, msg) {
    $rootScope.alerts.push({type: type, msg: msg});
  };

  factory.closeAlert = function(index) {
    $rootScope.alerts.splice(index, 1);
  }; 

  $rootScope.addAlert = factory.addAlert;

  $rootScope.closeAlert = factory.closeAlert;

  return factory;
});