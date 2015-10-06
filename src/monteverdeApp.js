'use sctrict';

var monteverde = angular.module('monteverde', [
    'ui.router',
    'common.module',
    'satellizer',
    'uiSwitch',
    'flow',
    'ngTable',
    'ngTableExport'
  ]
);

// app configuration
monteverde.config(function ( $urlRouterProvider, $stateProvider, $authProvider, $httpProvider) {
    // setup the Auth
    $authProvider.baseUrl = "/"
    $authProvider.loginUrl = "/login";
    $authProvider.signupUrl = "api/signup";
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
      // route to run services
      .state('runSvc', {
        controller : 'runSvcCtrl',
        controllerAs : 'runSvc',
        templateUrl : 'views/runSvc/runSvc.html',
        url : '/runSvc'
      })
      // route to schedule services
      .state('scheduleSvc', {
        controller : 'scheduleSvcCtrl',
        controllerAs : 'scheduleSvc',
        templateUrl : 'views/scheduleSvc/scheduleSvc.html',
        url : '/scheduleSvc'
      })
      // route to create trips
      .state('createTrip', {
        controller : 'createTripCtrl',
        controllerAs : 'createTrip',
        templateUrl : 'views/createTrip/createTrip.html',
        url : '/createTrip'
      })
	    .state('tripReport', {
		    controller : 'tripReportCtrl',
		    controllerAs : 'tripReport',
		    templateUrl : 'views/tripReport/tripReport.html',
		    url : '/tripReport'
	    });

  $httpProvider.interceptors.push("httpInterceptor");
});

// app run
monteverde.run(function ($rootScope, $location, $state, $auth, $modal) {

  $rootScope.statesAllowedByRol = {
    'Administrador': 'All',
    'Coordinador' : 'scheduleSvc,runSvc,createTrip',
    'Interventor' : 'reportSvc,tripReport'
  };

  //some helpers
  Array.prototype.findById = function(_id, spectedData) {
    for (var ndx in this) {
      var element = this[ndx];

      if (element._id === _id) {
        return element[spectedData];
      }
    };

    return false;
  }; 

  Date.prototype.getRealMonth = function () {return this.getMonth() + 1};

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

    var userRol = $auth.getPayload().rol
    var statesAllowed = $rootScope.statesAllowedByRol[userRol.name]
    if (statesAllowed != 'All' && statesAllowed.split(",").indexOf(toState.name) < 0) {
      e.preventDefault(); // stop current execution
      if (userRol.name==='Coordinador') $state.go('scheduleSvc');
      else if (userRol.name==='Interventor') $state.go('reportSvc');
    }
  });

  $rootScope.appBusy = function (isBusy) {
    if (isBusy) {
      $rootScope.modalInstance = $modal.open({
        animation: false,
        template: '<div class="col-sm-12"><img id="loadingSpinner" onload=\'if(document.getElementById("loadingSpinner"))document.getElementById("loadingSpinner").parentNode.parentNode.className=""\' width="100%" src="/images/loading.gif"></div>',
        backdrop: false,
        keyboard: false,
        windowClass:"loading-modal-window",
        size: "lg",
        scope: $rootScope
      });
      $rootScope.isBusy=true;
    } else if (typeof $rootScope.modalInstance !== 'undefined') {
      $rootScope.modalInstance.dismiss('cancel');
      $rootScope.isBusy=false;
    }
  };
});
