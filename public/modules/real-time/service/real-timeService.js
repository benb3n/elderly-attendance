angular.module('RealTimeService', [])

.factory('RTService', function($http, $q, sensorReadingAPI, systemMonitoringAPI, deviceAPI, APIToken) {

    var service = {};
    service.getSensorReadings = getSensorReadings;
    service.getAllDevices = getAllDevices;
    
    return service;
    
    function getAllDevices(project_prefix, page_size, callback){
        /*var apiURL = "";
        if(typeof url != 'undefined'){
            apiURL = url;
        }else{
            apiURL = deviceAPI.url;
        }*/

        $http.get(deviceAPI.url  ,
            {
                headers: {
                    "Authorization": APIToken.token
                },
                params: {
                    project_prefix : project_prefix,
                    page_size: page_size
                }
            }
        )
        .then(
            function(result){ 
                callback(result.data) },
            function(){ callback(false) }
        );
     
    }

    function getSensorReadings (gw_device, start_datetime, end_datetime,  page_size, callback) { 
        $http.get(sensorReadingAPI.url ,
            {
                headers: {
                    "Authorization": APIToken.token
                },
                params: {
                    gw_device :gw_device,
                    start_datetime: start_datetime,
                    end_datetime: end_datetime,
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