angular.module('HistoricalService', [])

.factory('HService', function($http, starlightAPI, sensorReadingAPI, systemMonitoringAPI, deviceAPI, APIToken) {
    var service = {};
    service.getSensorReadings = getSensorReadings;
    service.getAllDevices = getAllDevices;

    return service;
    
    


    function getAllDevices(project_prefix){
        $http.get(deviceAPI.url ,
            {
                headers: {
                    "Authorization": APIToken.token
                },
                params: {
                    project_prefix : project_prefix
                }
            }
        )
        .then(
            function(result){ 
                callback(result.data) },
            function(){ callback(false) }
        );
    }

    function getSensorReadings (gw_device, start_date, end_date, page_size, callback) { 
        /*var apiURL = "";
        if(typeof url != 'undefined'){
            apiURL = url;
        }else{
            apiURL = sensorReadingAPI.url;
        }*/
        $http.get(sensorReadingAPI.url,
            {
                headers: {
                    "Authorization": APIToken.token
                },
                params: {
                    gw_device: gw_device,
                    start_datetime: start_date,
                    end_datetime: end_date,
                    page_size: page_size
                }
            }
        )
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }
});