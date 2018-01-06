angular.module('SystemMonitoringService', [])

.factory('SMService', function($http, $q, starlightAPI, sensorReadingAPI, systemMonitoringAPI, deviceAPI, APIToken) {

    var service = {};
    service.getSystemMonitoringDevice = getSystemMonitoringDevice;
    service.getAllDevices = getAllDevices;
    service.getAllResidents = getAllResidents;
    service.addDevice = addDevice;
    service.updateDevice = updateDevice;
    
    return service;
    

    function getAllDevices(params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        console.log(params)
        $http.get(starlightAPI.url + '/api/v1/manifest_device/device/', params)
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }

    function getAllResidents(project_prefix, page_size, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(starlightAPI.url + '/api/v1/manifest_user/resident/',{
            params: {
                project_prefix: project_prefix,
                page_size: page_size
            }
        })
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }

    function getSystemMonitoringDevice (params, callback) { 
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(starlightAPI.url + '/api/v1/manifest_center/centerbatteryreading/', params)
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