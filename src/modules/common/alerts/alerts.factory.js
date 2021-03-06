// Factory to manage the alerts
'use strict';

common.factory('AlertsFactory', function ($rootScope, $timeout) {
  var factory = {};

  $rootScope.alerts = [];

  factory.addAlert = function(type, msg, disposable) {
    var ndx = $rootScope.alerts.push({type: type, msg: msg, destroy: null});
    if (disposable) {
      var i = ndx - 1,
          alert = $rootScope.alerts[i];
      $timeout (function () {
        factory.closeAlert(i, alert);
      }, 1500);
    }
  };

  factory.closeAlert = function(index, alert) {
    alert.destroy = "opacity : 0";
    $timeout (function () {
      $rootScope.alerts.splice(index, 1);
    }, 500);
  }; 

  factory.closeAllAlerts = function() {
    for(i=$rootScope.alerts.length; i > 0; i--) {
      var j = i-1;
      var alert = $rootScope.alerts[j];
      factory.closeAlert(j, alert);
    }
  };

  $rootScope.addAlert = factory.addAlert;

  $rootScope.closeAlert = factory.closeAlert;

  return factory;
});