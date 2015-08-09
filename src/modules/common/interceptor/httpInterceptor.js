// JSON rest formatter service
'use strict';

common.factory("httpInterceptor", function($q, $rootScope) {
    return {
        'request': function (config) {
            //calls appBusy if url starts with /api/
            if (!$rootScope.isBusy && (config.url.indexOf('/api/') == 0 || config.url.indexOf('/upload') == 0)) {
                $rootScope.appBusy(true);
                $rootScope.ajaxUrl=config.url;
            }
            return config;
        },
        'response': function (response) {
            if ($rootScope.isBusy && $rootScope.ajaxUrl==response.config.url) {
                $rootScope.appBusy(false);
            }
            return response;
        }
    }
});