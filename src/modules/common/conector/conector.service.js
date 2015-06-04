// Connector service
'use strict';

common.service ('connectorService', function ($http, $q, $log, $timeout, socketFactory) {
  var that = this;

  this.ep = {
    tasks : "/api/service/tasks",
    species : "/api/service/species",
    teams : "/api/service/teams",
    zones : "/api/service/zones",
    serviceTypes : "/api/service/servicetypes",
    contracts : "/api/service/contracts",
    units : "/api/service/units",
    config : "/api/service/config/:code",
    // POST
    create : "/api/service/configservice"
  };

  socketFactory.on('notifyChanges', function (data) {
    that.uptadeData();
    console.log('Socket.io test log:', data);
  });  

  this.uptadeData = function () {
    console.log('updating all data');
  }; 

  // Http Requests
  
  this.getData = function (url, id) {
    var defer = $q.defer(),
        url = (id)? url + '/' + id : url;

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

    console.log(pData);

    $http.post(url, pData)
      .success(function(data) {
        defer.resolve(data);
      })
      .error(function() {
        defer.reject();
      });

    return defer.promise;
  };

  this.editData = function (user, data) {
    var defer = $q.defer(),
        url = spotsUrl + '/' + user;

    $http.put(url, data)
      .success(function(data) {
        defer.resolve(data);
      })
      .error(function() {
        defer.reject();
      });

    return defer.promise;
  };

  this.removeData = function (id) {
    var defer = $q.defer(),
        url = spotsUrl + '/' + id;

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