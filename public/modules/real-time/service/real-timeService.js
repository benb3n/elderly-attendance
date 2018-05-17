angular.module('RealTimeService', [])

.factory('RTService', function($http, $q, digitalOceanAPI, sensorReadingAPI, systemMonitoringAPI, deviceAPI, APIToken, RealTimeThreshold) {

    var service = {};
    service.getSensorReadings = getSensorReadings;
    service.getAllDevices = getAllDevices;
    service.getAllResidents = getAllResidents;
    service.getAllCenters = getAllCenters;
    service.getAllCentersActivity = getAllCentersActivity;
    service.getCurrentAttendees = getCurrentAttendees;
    service.createAttendance = createAttendance;
    service.editAttendance = editAttendance;
    service.viewAttendance = viewAttendance;

    return service;
    
    function viewAttendance(params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_center/centerattendance/', {params:params})
        .then(
            function(result){ callback(result.data) },
            function(error){ 
                console.log(error)
                callback(false) }
        );
        
    }

    function createAttendance(params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.post(digitalOceanAPI.url + '/api/v1/manifest_center/centerattendance/create', params)
        .then(
            function(result){ callback(result.data) },
            function(error){ 
                console.log(error)
                callback(false) }
        ); 
    }

    function editAttendance(id, params, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.put(digitalOceanAPI.url + '/api/v1/manifest_center/centerattendance/'+ id +'/', params)
        .then(
            function(result){ callback(result.data) },
            function(error){ 
                console.log(error)
                callback(false) }
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

    function getAllResidents(project_prefix, callback){
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
    

    function getAllCenters(project_prefix, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_center/center/',{
            params: {
                project_prefix: project_prefix
            }
        })
        .then(
            function(result){ callback(result.data) },
            function(){ callback(false) }
        );
    }

    function getAllCentersActivity(project_prefix, center_code_name, start_date, end_date, callback){
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

    function getCurrentAttendees(project_prefix, center_code_name, start_date, end_date, recent_threshold_min, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        var params = {
            project_prefix: project_prefix,
            center_code_name: center_code_name,
            start_datetime: start_date,
            end_datetime: end_date,
            recent_threshold_min: recent_threshold_min //RealTimeThreshold.recent_threshold_min,
        }
        console.log(params)
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_center/currentattendees/', {params: params})
        .then(
            function(result){ 
                console.log(result)
                callback(result.data) },
            function(){ callback(false) }
        );
    }

    function getSensorReadings (gw_device, start_datetime, end_datetime,  page_size, callback) { 
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(digitalOceanAPI.url + '/api/v1/readings/sensorreading/',
            {
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