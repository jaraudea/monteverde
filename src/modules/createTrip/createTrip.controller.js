// create service controller
'use strict';

monteverde.controller('createTripCtrl', function ($state, $scope, ngTableParams, AlertsFactory, connectorService, dateTimeHelper) {
  var contractId = null

  $scope.controls = {}
  $scope.formData = {}

	var init = function () {
		dataGet('contracts')
		dataGet('vehicles')
		$scope.formData.date = dateTimeHelper.truncateDateTime(new Date())
	}

	$scope.loadTripInfo = function() {
		var data =  $scope.formData
		if (typeof data.contract !== 'undefined' && typeof data.serviceType !== 'undefined'
			&& typeof data.zone !== 'undefined' && typeof data.date !== 'undefined' && typeof data.vehicle !== 'undefined') {
			var tripDate = dateTimeHelper.truncateDateTime(data.date)
			dataGet('getTrip', '?contract='+data.contract + '&serviceType=' + data.serviceType + '&zone=' + data.zone + '&tripDate=' + tripDate + '&vehicle=' + data.vehicle,
				function(trip) {
					if (typeof trip !== 'undefined' && trip !== null) {
						$scope.formData.contract = trip.contract
						$scope.formData.serviceType = trip.serviceType
						$scope.formData.zone = trip.zone
						$scope.formData.date = new Date(trip.tripDate)
						$scope.formData.vehicle = trip.vehicle
						$scope.formData.tripsNumber = trip.tripsNumber
						$scope.formData.id = trip._id
					}
			})
		}
	}

  $scope.submitcreateTrip = function () {
    var form = $scope.createTripForm,
        data = $scope.formData,
        valid = form.$valid
    if (valid) {
	    // Check if is editting or creating
	    if (typeof data.id === 'undefined' ) {
		    connectorService.setData(connectorService.ep.createTrip, data)
			    .then(function (data) {
				    AlertsFactory.addAlert('success', 'Viaje creado.', true);
				    $state.go($state.current, {}, {reload: true});
			    },
			    function (err) {
				    AlertsFactory.addAlert('danger', 'Error al crear el viaje.', true);
			    });
	    } else {
		    connectorService.editData(connectorService.ep.updateTrip, data.id, data)
			    .then(function (data) {
				    AlertsFactory.addAlert('success', 'Viaje actualizado.', true);
				    $state.go($state.current, {}, {reload: true});
			    },
			    function (err) {
				    AlertsFactory.addAlert('danger', 'Error al actualizar el viaje.', true);
			    });
	    }
    } else {
      AlertsFactory.addAlert('warning', 'Por favor llene todos los campos correctamente antes de crear el viaje', true);
    }
  }

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

	$scope.clearTripNumber = function() {
		$scope.formData.tripsNumber = ''
		$scope.formData.id = undefined
	}

  $scope.reset = function() {
    contractId = null
    $scope.controls = {}
    $scope.formData = {}
    $scope.formData.date = dateTimeHelper.truncateDateTime(new Date())
  };

  $scope.reset()

  init()
});