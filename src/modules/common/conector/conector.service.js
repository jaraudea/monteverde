// Connector service
'use strict';

common.service ('connectorService', function ($http, $q, $log, $timeout, socketFactory) {
  var that = this;

  this.ep = {
    // GET
    tasks : "/api/service/tasks/",
    execPercent : "api/service/executeService/executionPercentage", 
    species : "/api/service/species/",
    teams : "/api/service/teams/",
    zones : "/api/service/zones/",
    serviceTypes : "/api/service/servicetypes/",
    contracts : "/api/service/contracts/",
    units : "/api/service/units/",
    config : "/api/service/config/:code/",
    envAuths : "/api/service/environmentalauthorities/",
    codes : "/api/service/configservice/codes/",
    serviceConf : "/api/service/configservice/",
    vehicles : "api/service/vehicles",
    executeService : "api/service/executeService",
    executeServiceById : '/api/service/executeService',
    services : "/api/service/services",
    serviceInMonth: "/api/service/serviceInMonth",
    // POST
    createSrv : "api/service/executeService",
    create : "/api/service/configservice/",
    approveSvc : "/api/service/approveService/",
    getExecution : "/api/service/configservice",        
    disapproveSvc : "/api/service/disapproveService/",
    // PUT
    updateExecution : "/api/service/executeService/",
    // DELETE
    deleteSrv : "api/service/executeService"
  };

  socketFactory.on('notifyChanges', function (data) {
    that.uptadeData();
    console.log('Socket.io test log:', data);
  });  

  this.uptadeData = function () {
    console.log('updating all data');
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