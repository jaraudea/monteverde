// Factory to manage the alerts
'use strict';

common.factory('AlertsFactory', function ($rootScope) {
  var alerts = {};

  $rootScope.alerts = [];

  alerts.addAlert = function(type, msg) {
    $rootScope.alerts.push({type: type, msg: msg});
  };

  alerts.closeAlert = function(index) {
    $rootScope.alerts.splice(index, 1);
  }; 

  $rootScope.addAlert = alerts.addAlert;

  $rootScope.closeAlert = alerts.closeAlert;

  return alerts;
});