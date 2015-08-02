// report service controller

'use strict';

monteverde.controller('tripReportCtrl', function ($state, $scope, $modal, $filter, $q, ngTableParams, $sce, connectorService, socketFactory, dateTimeHelper) {
  var contractId = null;

  // Socket IO
  socketFactory.on('notifyChanges', function (data) {
    $scope.loaddatatable();
  });

  $scope.tableData = [];

  $scope.controls = {};

  $scope.disapproval = {};

  var date = new Date();
  var firstDay = dateTimeHelper.truncateDateTime(new Date(date.getFullYear(), date.getMonth(), 1));
  var lastDay = dateTimeHelper.truncateDateTime(new Date(date.getFullYear(), date.getMonth() + 1, 0));

  $scope.formData = {startDate: firstDay, endDate: lastDay};

  var init = function () {
    dataGet('contracts');
  };

  // Method to GET data
  var dataGet = function (type, param, callback) {
    var url = (typeof param !== 'undefined') ? connectorService.ep[type] + param : connectorService.ep[type];
    connectorService.getData(url)
      .then(function (data) {
        if (typeof callback === 'function'){
          callback(data);
        } else {
          $scope.controls[type] = data;
        };
      });    
  }

  $scope.$watch("filter.$", function () {
    $scope.loaddatatable();
  });

  $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10,           // count per page
      sorting: {
        'vehicle.plate': 'asc'
      }
  }, {
      total: $scope.tableData.length, // length of data
      counts: [10, 50, 100, 10000],
      getData: function($defer, params) {
        var filteredData = $filter('filter')($scope.tableData, $scope.filter);
        var orderedData = params.sorting() ? 
          $filter('orderBy')(filteredData, params.orderBy()) :
          filteredData;

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve($scope.services = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
  });

  $scope.checkboxes = { 'checked': false, items: {} };

  // watch for check all checkbox
  $scope.$watch('checkboxes.checked', function(value) {
      angular.forEach($scope.services, function(item) {
          if (angular.isDefined(item._id)) {
              if ($scope.isCheckboxShowedByStatus(item.status._id)) {
                $scope.checkboxes.items[item._id] = value;
              }
          }
      });
  });

  // watch for data checkboxes
  $scope.$watch('checkboxes.items', function(values) {
      if (!$scope.services) {
          return;
      }
      var checked = 0, unchecked = 0,
              total = $scope.services.length;
      angular.forEach($scope.services, function(item) {
          checked   +=  ($scope.checkboxes.items[item._id]) || 0;
          unchecked += (!$scope.checkboxes.items[item._id]) || 0;
      });
      if ((unchecked == 0) || (checked == 0)) {
          $scope.checkboxes.checked = (checked == total);
      }
      // grayed checkbox
      angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
  }, true);

  $scope.loaddatatable = function () {
    var formData = $scope.formData;
    if (areAllFiltersSet())  {
	    var startDate = dateTimeHelper.truncateDateTime(formData.startDate)
	    var endDate = dateTimeHelper.truncateDateTime(formData.endDate)
	    dataGet('getTrips',
        '?contract=' + formData.contract 
        + '&serviceType=' + formData.serviceType 
        + '&zone=' + formData.zone 
        + '&startDate=' + startDate
        + '&endDate=' + endDate,
        function(trips) {
          $scope.tableData = trips;
          $scope.tableParams.reload();
          $scope.tableParams.$params.page = 1;
      });
    }
  };

  $scope.approveTrips = function() {
    var changed = false;
    for (item in $scope.checkboxes.items){
      if ($scope.checkboxes.items[item]) {
        connectorService.editData(connectorService.ep.approveTrip, item);
        $scope.checkboxes.items[item] = false;
        changed =  true;
      }
    }
    if (changed) {
      $scope.loaddatatable()
    }
  };

  $scope.disapprovalTrips = function () {
    $scope.modalInstance.close($scope.disapproval.reason);
    var changed = false;
    for (item in $scope.checkboxes.items){
      if ($scope.checkboxes.items[item]) {
        connectorService.editData(connectorService.ep.disapproveTrip, item, $scope.disapproval);
        $scope.checkboxes.items[item] = false;
        changed =  true;
      }
    }
    if (changed) {
      $scope.loaddatatable()
    }
  };

  $scope.cancelDisapproval = function () {
    $scope.modalInstance.dismiss('cancel');
  };

  $scope.openDisapprovalReasonModal = function() {
    if ($scope.checkboxes.items) {
      $scope.modalInstance = $modal.open({
        animation: true,
        templateUrl: 'disapprovalMessageModal',
        scope: $scope,
        size: 400
      });

      $scope.modalInstance.result.then(function (disapprovalReason) {
        $scope.disapproval.reason = disapprovalReason;
      });
    }
  };

  $scope.isExecutedTrip = function(status) {
    return status == '55b555a69e52ff86df79d7fb';
  };

  $scope.isCheckboxShowedByStatus = function(status) {
    return $scope.isExecutedTrip(status);
  };

  var areAllFiltersSet = function() {
    var formData = $scope.formData;
    return (typeof formData.contract != 'undefined') && (formData.contract != null)
      && (typeof formData.serviceType != 'undefined') && (formData.serviceType != null)
      && (typeof formData.zone != 'undefined') && (formData.zone != null)
      && (typeof formData.startDate != 'undefined') && (formData.startDate != null)
      && (typeof formData.endDate != 'undefined') && (formData.endDate != null);
  }

  init();
});