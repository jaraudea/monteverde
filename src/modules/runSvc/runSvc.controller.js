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
