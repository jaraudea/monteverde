// run service controller

'use strict';

monteverde.controller('runSvcCtrl', function ($state, $scope, $filter, ngTableParams) {
  var data = [
      {field: "Moroni", team: 50, state: 1, options: 1},
      {field: "Tiancum", team: 43, state: 1, options: 1},
      {field: "Jacob", team: 27, state: 1, options: 1},
      {field: "Nephi", team: 29, state: 1, options: 1},
      {field: "Enos", team: 34, state: 1, options: 1},
      {field: "Tiancum", team: 43, state: 1, options: 1},
      {field: "Jacob", team: 27, state: 1, options: 1},
      {field: "Nephi", team: 29, state: 1, options: 1},
      {field: "Enos", team: 34, state: 1, options: 1},
      {field: "Tiancum", team: 43, state: 1, options: 1},
      {field: "Jacob", team: 27, state: 1, options: 1},
      {field: "Nephi", team: 29, state: 1, options: 1},
      {field: "Enos", team: 34, state: 1, options: 1},
      {field: "Tiancum", team: 43, state: 1, options: 1},
      {field: "Jacob", team: 27, state: 1, options: 1},
      {field: "Nephi", team: 29, state: 1, options: 1},
      {field: "Enos", team: 34, state: 1, options: 1}
  ];

  $scope.fields = [
      'A123',
      'B456',
      'C567',
      'R342',
      'Y565',
      'L897'
  ];

  $scope.teams = [
      'uno',
      'dos',
      'tres',
      '1uno',
      '2dos',
      '3tres'
  ];

  $scope.vehicles = [
      'abc 123',
      'def 456',
      'hij 789',
      'qaz 147',
      'wsx 258',
      'rfv 369'
  ];

  $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 10           // count per page
  }, {
      total: data.length, // length of data
      getData: function($defer, params) {
          // use build-in angular filter
          var orderedData = params.sorting() ?
                  $filter('orderBy')(data, params.orderBy()) :
                  data;

          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
   })
});
