/**
 * Created by Anderson on 7/25/2015.
 */

exports.truncateDateTime = function(date) {
		date.setHours(0)
		date.setMinutes(0)
		date.setSeconds(0)
		date.setMilliseconds(0)
		return date
}