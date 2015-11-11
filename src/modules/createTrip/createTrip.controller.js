// create service controller
'use strict';

monteverde.controller('createTripCtrl', function ($rootScope, $state, $scope, ngTableParams, AlertsFactory, connectorService, dateTimeHelper, tripService) {
  var contractId = null;

  $scope.controls = {};
  $scope.formData = {};

	var init = function () {
		dataGet('contracts');
		dataGet('vehicles');
		$scope.formData.date = dateTimeHelper.truncateDateTime(new Date());
	}

	$scope.loadVehicleInfo = function() {
		var vehicleId = $scope.formData.vehicle;
		if (typeof vehicleId !== 'undefined' && vehicleId != null) {
			dataGet('vehicle', vehicleId, function (vehicle) {
				$scope.vehicleObj = vehicle;
			});
		}
	}

	$scope.clearContractData = function() {
		$scope.formData.serviceType = undefined;
		$scope.formData.zone = undefined;
	}

	$scope.loadTripInfo = function() {
		var data =  $scope.formData;
		if (typeof data.contract !== 'undefined' && typeof data.serviceType !== 'undefined'
			&& typeof data.zone !== 'undefined' && typeof data.date !== 'undefined' && typeof data.vehicle !== 'undefined') {
			var tripDate = dateTimeHelper.truncateDateTime(data.date)
			dataGet('getTrip', '?contract='+data.contract + '&serviceType=' + data.serviceType + '&zone=' + data.zone + '&tripDate=' + tripDate + '&vehicle=' + data.vehicle,
				function(trip) {
					if (typeof trip !== 'undefined' && trip !== null) {
						loadTripInfoDetails(trip);
					}
			})
		}
	}

	var loadTripInfoDetails = function(trip) {
		$scope.formData.contract = trip.contract;
		$scope.formData.serviceType = trip.serviceType;
		$scope.formData.zone = trip.zone;
		$scope.formData.date = new Date(trip.tripDate);
		$scope.formData.vehicle = trip.vehicle._id;
		$scope.formData.tripsNumber = trip.tripsNumber;
		$scope.formData.id = trip._id;
		$scope.formData.quantity = roundToTwoDecimals(trip.vehicle.cubicMeters * trip.tripsNumber);
    $scope.vehicleObj = trip.vehicle;
	}

	$scope.calculateQuantity = function() {
		var trips = $scope.formData.tripsNumber;
		var vehicle = $scope.vehicleObj;
		if (typeof trips !== 'undefined' && trips != null
				&& typeof vehicle !== 'undefined' && vehicle != null) {
			$scope.formData.quantity = roundToTwoDecimals(vehicle.cubicMeters * trips);
		} else {
			$scope.formData.quantity = '';
		}
	}

  $scope.submitcreateTrip = function () {
    var form = $scope.createTripForm,
        data = $scope.formData,
        valid = form.$valid;
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
						$rootScope.tripFormData = $scope.formData;
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
        if (typeof callback === 'function') {
          callback(data);
        } else {
          $scope.controls[type] = data;
        };
      });    
  }

  var roundToTwoDecimals = function(num) {
    return Math.round(num * 100) / 100;
  }

	$scope.clearTripNumber = function() {
		$scope.formData.tripsNumber = '';
		$scope.formData.id = undefined;
	}

  $scope.reset = function() {
    contractId = null;
    $scope.formData = {};
    $scope.formData.date = dateTimeHelper.truncateDateTime(new Date());
		$scope.vehicleObj = undefined;
  };

  $scope.reset();

	$scope.relodaData = function() {
    if (typeof tripService.getTrip() !== 'undefined') {
      loadTripInfoDetails(tripService.getTrip());
      tripService.setTrip(undefined);
    } else if (typeof $rootScope.tripFormData !== 'undefined') {
			$scope.formData.contract = $rootScope.tripFormData.contract;
			$scope.formData.serviceType = $rootScope.tripFormData.serviceType;
			$scope.formData.zone = $rootScope.tripFormData.zone;
			$scope.formData.date = $rootScope.tripFormData.date;
		}
	};

	$scope.relodaData();

  init();
});