angular.module('SystemMonitoringService', [])

.factory('SMService', function($http, $q, sensorReadingAPI, systemMonitoringAPI, deviceAPI, APIToken) {

    var service = {};
    service.getSystemMonitoringDevice = getSystemMonitoringDevice;
    service.getSystemMonitoringDevicesByGwDevice = getSystemMonitoringDevicesByGwDevice;
    service.getAllDevices = getAllDevices;
    service.addDevice = addDevice;
    service.updateDevice = updateDevice;
    
    return service;
    
    function getAllDevices(project_prefix, page_size, callback){
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

    function getSystemMonitoringDevice (reading_type, start_datetime, page_size, callback) { 
        $http.get(systemMonitoringAPI.url ,
            {
                headers: {
                    "Authorization": APIToken.token
                },
                params: {
                    reading_type: reading_type,
                    start_datetime: start_datetime,
                    page_size: page_size
                }
            }
        )
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }

    function getSystemMonitoringDevicesByGwDevice (gw_device, reading_type, page_size, callback) { 
        $http.get(systemMonitoringAPI.url ,
            {
                headers: {
                    "Authorization": APIToken.token
                },
                params: {
                    gw_device :gw_device,
                    reading_type: reading_type,
                    page_size: page_size
                }
            }
        )
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }

    function addDevice (params, callback) { 
        $http.post(systemMonitoringAPI.url ,
            {
                headers: {
                    "Authorization": APIToken.token
                },
                params: params
            }
        )
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }

    function updateDevice (params, callback) { 
        $http.put(systemMonitoringAPI.url ,
            {
                headers: {
                    "Authorization": APIToken.token
                },
                params: params
            }
        )
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }
});