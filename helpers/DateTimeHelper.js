/**
 * Created by Anderson on 7/25/2015.
 */

exports.truncateDateTime = function(date) {
	date.setHours(0, -date.getTimezoneOffset(), 0, 0)
	return date
}