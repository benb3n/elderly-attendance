angular.module('LoginService', [])

.factory('LService', function($http, sensorReadingAPI, systemMonitoringAPI, deviceAPI, APIToken) {
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

  
