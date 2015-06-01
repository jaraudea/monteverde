// main controller
'use strict';

monteverde.controller('monteverdeCtrl', function ($scope) {
  $scope.alerts = [
    { type: 'success', msg: 'Todo ha sido guardado!' }
  ];

  $scope.addAlert = function() {
    $scope.alerts.push({type: 'danger', msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };  
});