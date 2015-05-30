'use sctrict';

var monteverde = angular.module('monteverde', [
    'ui.router',
    'common.module',
    // 'satellizer',
    'ngDialog'
  ]).config(function ( $urlRouterProvider, $stateProvider) {
    // When no url finds a match redirect to /
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
      .state('home', {
        templateUrl : 'views/home/home.html',
        url : '/'
      })
      .state('login', {
        controller : 'loginCtrl',
        controllerAs : 'login',
        templateUrl : 'views/login/login.html',
        url : '/login'
      });
});