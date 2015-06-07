// schedule service controller

'use strict';

monteverde.controller('scheduleSvcCtrl', function ($state, $scope, $modal, ngTableParams, AlertsFactory, connectorService, $filter) {

  var contractId = null,
      dataSpecieTable = [];

  $scope.controls = {};

  $scope.formData = {};

  $scope.codes = [];

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    language: 'es'
  };

  $scope.uploader = {
    target : "/upload",
    testChunks : true
  }
  

  $scope.doneQuantity = 356;


  $scope.open = function(img) {
    var base64;
    var fileReader = new FileReader();
      fileReader.onload = function (event) {
            base64 = event.target.result;

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                template: '<img width="400" class="center-block" src="' + base64 + '" >'
            })
        };

    fileReader.readAsDataURL(img.file);

    console.log(img, base64, fileReader, fileReader.readAsDataURL);
    
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

  var init = function () {
    dataGet('zones');
    dataGet('contracts');
    dataGet('teams');
    dataGet('units');
    dataGet('codes', '', function (data) {
      for (var ndx in data) {
        $scope.codes.push(data[ndx].code);
      };
    });
  }

 var data = [
      {field: "Moroni", team: 50, state: 1, options: 1},
      {field: "Tiancum", team: 43, state: 1, options: 1}
  ];

  $scope.fields = [
      'A123',
      'B456',
      'C567',
      'R342',
      'Y565',
      'L897'
  ];

  $scope.vehicles = [
      'abc 123',
      'def 456',
      'hij 789',
      'qaz 147',
      'wsx 258',
      'rfv 369'
  ];

  $scope.percent = 25;

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
   });

  init();
});