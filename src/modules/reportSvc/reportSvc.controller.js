// report service controller

'use strict';

monteverde.controller('reportSvcCtrl', function ($state, $scope, $filter, $q, ngTableParams, $sce) {
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

  $scope.$watch("filter.$", function () {
    $scope.tableParams.reload();
  });

  $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10           // count per page
  }, {
      total: data.length, // length of data
      getData: function($defer, params) {
          var filteredData = $filter('filter')(data, $scope.filter);
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
          if (angular.isDefined(item.id)) {
              $scope.checkboxes.items[item.id] = value;
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
          checked   +=  ($scope.checkboxes.items[item.id]) || 0;
          unchecked += (!$scope.checkboxes.items[item.id]) || 0;
      });
      if ((unchecked == 0) || (checked == 0)) {
          $scope.checkboxes.checked = (checked == total);
      }
      // grayed checkbox
      angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
  }, true);
});