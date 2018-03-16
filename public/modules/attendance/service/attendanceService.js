angular.module('AttendanceService', [])

.factory('AService', function($http, $q, starlightAPI, digitalOceanAPI, systemMonitoringAPI, deviceAPI, APIToken) {

    var service = {};
    service.getSensorReadings = getSensorReadings;
    service.getAllDevices = getAllDevices;
    service.getAllResidents = getAllResidents;
    service.getAllCenters = getAllCenters;
    service.getAllCentersActivity = getAllCentersActivity;
    service.getAllResidentsAlerts = getAllResidentsAlerts;
    service.addResident = addResident
    service.updateResident = updateResident;
    service.addActivity = addActivity
    service.updateActivity = updateActivity;
    service.getAllProjects = getAllProjects;

    return service;

    function updateActivity(id, params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.put(digitalOceanAPI.url + '/api/v1/manifest_center/centeractivity/' + id + "/", params, {
        }).then(
            function(result){ 
                console.log(result);
                callback(result.data) },
            function(error){ 
                console.log(error )
                callback(false) }
        );
    }

    function addActivity(params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.post(digitalOceanAPI.url + '/api/v1/manifest_center/centeractivity/create', params).then(
        function(result){ 
            console.log(result)
            callback(result.data) },
        function(error){ 
            console.log(error )
            callback( (typeof error.data.non_field_errors == 'undefined')? false : error.data.non_field_errors[0]  )});
    }

    function updateResident(id, params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.put(digitalOceanAPI.url + '/api/v1/manifest_user/participant/' + id + "/", params, {
        }).then(
            function(result){ 
                console.log(result);
                callback(result.data) },
            function(error){ 
                console.log(error )
                callback(false) }
        );
    }

    function addResident(params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.post(digitalOceanAPI.url + '/api/v1/manifest_user/participant/create', params).then(
        function(result){ 
            console.log(result)
            callback(result.data) },
        function(error){ 
            console.log(error )
            callback( (typeof error.data.non_field_errors == 'undefined')? false : error.data.non_field_errors[0]  )});
    }

    function getAllResidents(project_prefix, page_size, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_user/participant/',{
            params: {
                project_prefix: project_prefix,
            }
        })
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }

    function getAllProjects(callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_user/project/')
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }

    function getAllResidentsAlerts(params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_center/centerattendee/', {
            params: params
        })
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }

    function getAllCenters(project_prefix, page_size, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_center/center/',{
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

    function getAllCentersActivity(project_prefix, center_code_name, start_date, end_date, page_size, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_center/centeractivity/',{
            params: {
                project_prefix: project_prefix,
                center_code_name: center_code_name,
                start_date: start_date,
                end_date: end_date
            }
        })
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }
    
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

    function getSensorReadings (gw_device, start_datetime, end_datetime, page_size, callback) { 
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