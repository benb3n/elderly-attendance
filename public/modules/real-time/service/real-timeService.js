angular.module('RealTimeService', [])

.factory('RTService', function($http, sensorReadingAPI, systemMonitoringAPI) {

    var service = {};
    service.getSensorReadings = getSensorReadings;

    return service;
    
    function getSensorReadings (gw_device, callback) { 
        console.log(gw_device)
        console.log(sensorReadingAPI.url)
        
        $http.get(sensorReadingAPI.url ,
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Authorization": "Token b2f2c8bd87dff8fa0fb1c2fc24b29f9c551bc21c"
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