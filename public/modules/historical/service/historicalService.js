angular.module('HistoricalService', [])

.factory('HService', function($http, sensorReadingAPI, systemMonitoringAPI, APIToken) {
    var service = {};
    service.getSensorReadings = getSensorReadings;

    return service;
    
    function getSensorReadings (gw_device, start_date, end_date, callback) { 
        $http.get(sensorReadingAPI.url ,
            {
                headers: {
                    "Authorization": APIToken.token
                },
                params: {
                    gw_device :gw_device,
                    start_datetime: start_date,
                    end_datetime: end_date
                }
            }
        )
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }
});