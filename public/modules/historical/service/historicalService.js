angular.module('HistoricalService', [])

.factory('HService', function($http, starlightAPI, sensorReadingAPI, systemMonitoringAPI, deviceAPI, APIToken) {
    var service = {};
    service.getSensorReadings = getSensorReadings;
    service.getAllDevices = getAllDevices;
    service.getAllCenterAttendanceInterval = getAllCenterAttendanceInterval;
    service.getCenterActivities = getCenterActivities;

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

    function getAllCenterAttendanceInterval(project_prefix, center_code_name, start_datetime, end_datetime, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken;
        $http.get(starlightAPI.url + '/api/v1/manifest_center/centerattendanceinterval/',
            {
                /*headers: {
                    "Authorization": APIToken.token
                },*/
                params: {
                    project_prefix : project_prefix,
                    center_code_name: center_code_name,
                    start_datetime: start_datetime,
                    end_datetime: end_datetime
                }
            }
        )
        .then(
            function(result){
                callback(result.data) },
            function(){ callback(false) }
        );
    }

    function getCenterActivities(project_prefix, center_code_name, start_date, end_date, callback){
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken;
        $http.get(starlightAPI.url + '/api/v1/manifest_center/centeractivity/',
        //https://dev-starlight.icitylab.com/api/v1/manifest_center/centeractivity/?end_date=2017-12-31
            {
                /*headers: {
                    "Authorization": APIToken.token
                },*/
                params: {
                    project_prefix : project_prefix,
                    center_code_name: center_code_name,
                    start_date: start_date,
                    end_date: end_date
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
