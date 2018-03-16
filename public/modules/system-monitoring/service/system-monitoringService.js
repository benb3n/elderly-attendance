angular.module('SystemMonitoringService', [])

.factory('SMService', function($http, $q, digitalOceanAPI, sensorReadingAPI, systemMonitoringAPI, deviceAPI, APIToken) {

    var service = {};
    service.getSystemMonitoringDevice = getSystemMonitoringDevice;
    service.getAllDevices = getAllDevices;
    service.getAllResidents = getAllResidents;
    service.addDevice = addDevice;
    service.updateDevice = updateDevice;
    service.addDeviceMapping = addDeviceMapping;
    service.updateDeviceMapping = updateDeviceMapping;

    return service;
    
    function updateDeviceMapping(id, params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        console.log(params)
        $http.put(digitalOceanAPI.url + '/api/v1/manifest_device/devicelog/' + id + "/", params).then(
            function(result){ 
                console.log(result);
                callback(result.data) },
            function(error){ 
                console.log(error )
                callback(false) }
        );
    }

    function addDeviceMapping(params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        console.log(params)
        $http.post(digitalOceanAPI.url + '/api/v1/manifest_device/devicelog/create', params).then(
        function(result){ 
            console.log(result)
            callback(result.data) },
        function(error){ 
            console.log(error )
            callback( (typeof error.data.non_field_errors == 'undefined')? false : error.data.non_field_errors[0]  )});
    }

    function updateDevice(id, params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        console.log(params)
        $http.put(digitalOceanAPI.url + '/api/v1/manifest_device/device/' + id + "/", params).then(
            function(result){ 
                console.log(result);
                callback(result.data) },
            function(error){ 
                console.log(error )
                callback(false) }
        );
    }

    function addDevice(params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        console.log(params)
        $http.post(digitalOceanAPI.url + '/api/v1/manifest_device/device/create', params).then(
        function(result){ 
            console.log(result)
            callback(result.data) },
        function(error){ 
            console.log(error )
            callback( (typeof error.data.non_field_errors == 'undefined')? false : error.data.non_field_errors[0]  )});
    }

    function getAllDevices(params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_device/device/', params)
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }

    function getAllResidents(project_prefix, page_size, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_user/partipants/',{
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


    /*function addDevice (params, callback) { 
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
    }*/
});