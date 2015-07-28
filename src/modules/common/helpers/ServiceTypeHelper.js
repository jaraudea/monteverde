// JSON rest formatter service
'use strict';

common.service ('serviceTypeHelper', function () {

    this.isPrunningService = function(status) {
        return status === '5563efe645051764c2e3da13'
    }

    this.isGrassService = function(status) {
        return status === '5563efda45051764c2e3da12'
    }
});