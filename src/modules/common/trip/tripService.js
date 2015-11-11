common.factory('tripService', function() {
  var tripData;

  function setTrip(trip) {
    tripData = trip;
  }
  function getTrip() {
    return tripData;
  }

  return {
    setTrip: setTrip,
    getTrip: getTrip
  }

});