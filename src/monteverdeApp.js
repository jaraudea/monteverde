'use sctrict';

var monteverde = angular.module('monteverde', [
    'ui.router',
    'common.module',
    // 'satellizer',
    'ngDialog'
  ]).config(function ( $urlRouterProvider, $stateProvider) {
    // When no url finds a match redirect to /
    $urlRouterProvider.otherwise('/reportSvc');
    
    // Setup the basic routes
    
    // route to home 
    $stateProvider
      // route to create service
      .state('createSvc', {
        controller : 'createSvcCtrl',
        controllerAs : 'createSvc',
        templateUrl : 'views/createSvc/createSvc.html',
        url : '/createSvc'
      })
      // route to report services
      .state('reportSvc', {
        controller : 'reportSvcCtrl',
        controllerAs : 'reportSvc',
        templateUrl : 'views/reportSvc/reportSvc.html',
        url : '/reportSvc'
      })
      // route to report services
      .state('runSvc', {
        controller : 'runSvcCtrl',
        controllerAs : 'runSvc',
        templateUrl : 'views/runSvc/runSvc.html',
        url : '/runSvc'
      })
      // route to report services
      .state('scheduleSvc', {
        controller : 'scheduleSvcCtrl',
        controllerAs : 'scheduleSvc',
        templateUrl : 'views/scheduleSvc/scheduleSvc.html',
        url : '/scheduleSvc'
      });
});