// JSON rest formatter service
'use strict';

common.service ('dateTimeHelper', function () {

	this.truncateDateTime = function(date) {
		date.setHours(0, 0, 0, 0);
		return date
	}

});