// login controller
'use strict';

monteverde.controller ('loginCtrl', function ($scope, $state, $scope, $auth, AlertsFactory) {

  this.submitLogin = function () {
    var user = $scope.login.user;

    $auth.login(user)
      .then(function (data) {
        $state.go('createSvc');
      })
      .catch(function (response) {
        AlertsFactory.addAlert('danger', 'Error: Usuario y/o Contraseña son invalidos.', true);
      })
  } 

});