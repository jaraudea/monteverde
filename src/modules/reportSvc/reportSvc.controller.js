// report service controller

'use strict';

monteverde.controller('reportSvcCtrl', function ($state, $scope, $modal, $filter, $q, ngTableParams, $sce, connectorService) {
  var data = [
      {id: 1,  code: "0001",  name: 'Javier Ignacio Hurtado Hurtado', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 2,  code: "0002",  name: 'Javier Ignacio Hurtado Hurtado', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 3,  code: "0003",  name: 'Javier Ignacio Hurtado Hurtado', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 4,  code: "0004",  name: 'Javier Ignacio Hurtado Hurtado', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 5,  code: "0005",  name: 'Javier Ignacio Hurtado Hurtado', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 6,  code: "0006",  name: 'Javier Ignacio Hurtado Hurtado', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 7,  code: "0007",  name: 'Javier Ignacio Hurtado Hurtado', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 8,  code: "0008",  name: 'Javier Ignacio Hurtado Hurtado', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 9,  code: "0009",  name: 'Javier Ignacio Hurtado Hurtado', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 10, code: "00010", name: 'Helio Perez Jaramillo', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 11, code: "00011", name: 'Helio Perez Jaramillo', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 12, code: "00012", name: 'Helio Perez Jaramillo', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 13, code: "00013", name: 'Helio Perez Jaramillo', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 14, code: "00014", name: 'Helio Perez Jaramillo', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 15, code: "00015", name: 'Helio Perez Jaramillo', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 16, code: "00016", name: 'Helio Perez Jaramillo', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'},
      {id: 17, code: "00017", name: 'Helio Perez Jaramillo', address: 'Entre Carrera 56 y 78', phone: '(4) 4705000', scheduledDate: '01/01/2015', executedDate: '05/01/2015', approvedDate: '07/01/2015', disapproved: '07/01/2015', quantity: 507, unit: 'M2', specie: 'Laureles', task: 'Mantenimiento', photo: '500Foto05012015', status: 'Aprobado', description: 'varios...'}
  ]

  var contractId = null;

  $scope.tableData = [];

  $scope.controls = {};

  $scope.formData = {};

  var init = function () {
    dataGet('contracts');
    dataGet('zones');
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
    $scope.tableParams.reload();
  });

  $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10           // count per page
  }, {
      total: $scope.tableData.length, // length of data
      getData: function($defer, params) {
        var formData = $scope.formData;
        if ((typeof formData.contract != 'undefined') && (typeof formData.serviceType != 'undefined') && (typeof formData.zone != 'undefined') 
          && (typeof formData.startDate != 'undefined') && (typeof formData.endDate != 'undefined'))  {
          dataGet('services', 
            '?contract=' + formData.contract 
            + '&serviceType=' + formData.serviceType 
            + '&zone=' + formData.zone 
            + '&startDate=' + formData.startDate 
            + '&endDate=' + formData.endDate, 
            function(svcs) {
              var filteredData = $filter('filter')(svcs, $scope.filter);
              var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

              params.total(orderedData.length); // set total for recalc pagination
              $defer.resolve($scope.services = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });
        }
      }
  });

  $scope.checkboxes = { 'checked': false, items: {} };

  // watch for check all checkbox
  $scope.$watch('checkboxes.checked', function(value) {
      angular.forEach($scope.services, function(item) {
          if (angular.isDefined(item._id)) {
              if (!$scope.isApprovedOrDisapproved(item.status._id)) {
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

  $scope.loadtabledata = function () {
    $scope.tableParams.reload();
  };

  $scope.open = function(img) {
    var base64;
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
      base64 = event.target.result;

      var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          template: '<img width="1200" class="center-block" src="' + base64 + '" >'
      })
    };

    dataGet('downloadFile', img, function(file) {
      fileReader.readAsDataURL(file);
    });

    console.log(img, base64, fileReader, fileReader.readAsDataURL);  
  };

  $scope.approveServices = function() {
    var changed = false;
    for (item in $scope.checkboxes.items) {
      if ($scope.checkboxes.items[item]) {
        connectorService.editData(connectorService.ep.approveSvc, item);
        $scope.checkboxes.items[item] = false;
        changed =  true;
      }
    }
    if (changed) {
      $scope.loadtabledata()
    }
  };

  $scope.disapproveServices = function() {
    var changed = false;
    for (item in $scope.checkboxes.items) {
      if ($scope.checkboxes.items[item]) {
        connectorService.editData(connectorService.ep.disapproveSvc, item);
        $scope.checkboxes.items[item] = false;
        changed =  true;
      }
    }
    if (changed) {
      $scope.loadtabledata()
    }
  };

  $scope.isApprovedOrDisapproved = function(status) {
    return status == '556fcd3f540893b44a2aef03' || status == '556fcd8f540893b44a2aef06';
  };

  init();
});