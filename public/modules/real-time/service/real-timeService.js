angular.module('RealTimeService', [])

.factory('RTService', function($http, sensorReadingAPI, systemMonitoringAPI, APIToken) {

    var service = {};
    service.getSensorReadings = getSensorReadings;

    return service;
    
    function getSensorReadings (gw_device, callback) { 
        $http.get(sensorReadingAPI.url ,
            {
                headers: {
                    "Authorization": APIToken.token
                },
                params: {
                    gw_device :gw_device
                }
            }
        )
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }
});