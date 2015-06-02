'use sctrict';

var monteverde = angular.module('monteverde', [
    'ui.router',
    'common.module',
    'ngTable',
    'satellizer',
    'ngDialog',
    'uiSwitch'
  ]
);

// app configuration
monteverde.config(function ( $urlRouterProvider, $stateProvider, $authProvider) {
    // stup the Auth
    $authProvider.baseUrl = "http://localhost:3010"
    $authProvider.loginUrl = "API/auth";
    $authProvider.signupUrl = "API/auth";
    $authProvider.tokenName = "token";
    $authProvider.tokenPrefix = "monteverde";

    // When no url finds a match redirect to /
    $urlRouterProvider.otherwise('/createSvc');
    
    // Setup the basic routes
    
    // route to home 
    $stateProvider
      // route to login
      .state('login', {
        controller : 'loginCtrl',
        controllerAs : 'login',
        templateUrl : 'views/login/login.html',
        url : '/login'
      })
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

// app run
monteverde.run(function ($rootScope, $location, $state, $auth) {
  $rootScope.$on( '$stateChangeStart', function(e, toState  , toParams, fromState, fromParams) { 
    var isLogin = (toState.name === "login");
    
    // Check if is on login page
    if(isLogin){
       return; // no need to redirect 
    };

    // Redirect only not authenticated
    var userLogged = $auth.isAuthenticated();

    if(userLogged === false) {
        e.preventDefault(); // stop current execution
        $state.go('login'); // go to login
    };
  });
});