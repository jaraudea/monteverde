// Connector service
'use strict';

common.service ('connectorService', function ($http, $q, $log, $timeout, socketFactory) {
  var that = this;

  this.ep = {
    // GET
    tasks : "/api/service/tasks",
    execPercent : "api/service/executeService/executionPercentage", 
    species : "/api/service/species",
    teams : "/api/service/teams",
    zones : "/api/service/zones",
    serviceTypes : "/api/service/servicetypes",
    contracts : "/api/service/contracts",
    units : "/api/service/units",
    config : "/api/service/config/:code",
    envAuths : "/api/service/environmentalauthorities",
    codes : "/api/service/configservice/codes",
    serviceConf : "/api/service/configservice/",
    vehicles : "api/service/vehicles",
    vehicle : "api/service/vehicle/",
    executeService : "api/service/executeService",
    executeServiceById : '/api/service/executeService',
    services : "/api/service/services",
    serviceInMonth: "/api/service/serviceInMonth",
    scheduledSvcsWoExecution: "/api/service/scheduledServicesWoExecution",
    scheduledSvcsWoApprobation: "/api/service/scheduledServicesWoApprobation",
    oldDisapprovedSvcs: "/api/service/oldDisapprovedServices",
    getScheduledServices : "api/service/scheduledService",
	  getSchedPercentage: "/api/service/scheduledService/schedulingPercentage",
	  getTrip: "/api/trip",
	  getTrips: "/api/trip/trips",
    // POST
    createSrv : "api/service/executeService",
    create : "/api/service/configservice/",
    approveSvc : "/api/service/approveService/",
    getExecution : "/api/service/configservice",        
    disapproveSvc : "/api/service/disapproveService/",
    scheduleSrv : "api/service/scheduleService",
		createTrip: "/api/trip",
	  approveTrip : "/api/trip/approve/",
	  disapproveTrip : "/api/trip/disapprove/",
    removeTrip : "/api/trip/remove/",
    // PUT
    updateExecution : "/api/service/executeService/",
	  updateTrip: "/api/trip/",
    // DELETE
    deleteSrv : "api/service/executeService",
	  deleteTrip: "/api/trip/"
  };

  // Http Requests
  
  this.getData = function (url, q) {
    var defer = $q.defer(),
        url = (q)? url + '/' + q : url;

    $http.get(url)
      .success(function(data) {
        defer.resolve(data);
      })
      .error(function() {
        defer.reject();
      });

    return defer.promise;
  };

  this.setData = function (url, pData) {
    var defer = $q.defer();

    $http.post(url, pData)
      .success(function(data) {
        defer.resolve(data);
      })
      .error(function() {
        defer.reject();
      });

    return defer.promise;
  };

  this.editData = function (url, id, data) {
    var defer = $q.defer(),
        url = url + id;

    $http.put(url, data)
        .success(function(data) {
          defer.resolve(data);
        })
        .error(function() {
          defer.reject();
        });

    return defer.promise;
  };

  this.removeData = function (url, id) {
    var defer = $q.defer(),
        url = url + '/' + id;

    $http.delete(url)
      .success(function(data) {
        defer.resolve(data);
      })
      .error(function() {
        defer.reject();
      });

    return defer.promise;
  };
});