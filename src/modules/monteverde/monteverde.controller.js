// main controller
'use strict';

monteverde.controller('monteverdeCtrl', function ($scope, $auth, connectorService) {

  $scope.$watch(function () {
      return $auth.isAuthenticated()
    }, 
    function() {
      $scope.userLogged = $auth.isAuthenticated();
    }
  );

  $scope.logout = $auth.logout; 

});