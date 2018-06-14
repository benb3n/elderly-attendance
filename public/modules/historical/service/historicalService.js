angular.module('HistoricalService', [])

.factory('HService', function($http, starlightAPI, digitalOceanAPI, sensorReadingAPI, systemMonitoringAPI, deviceAPI, APIToken) {
    var service = {};
    service.getSensorReadings = getSensorReadings;
    service.getAllDevices = getAllDevices;
    service.getAllCenters = getAllCenters;
    service.getAllResidents = getAllResidents;
    service.getAllCenterAttendanceInterval = getAllCenterAttendanceInterval;
    service.getCenterActivities = getCenterActivities;
    service.generateReport = generateReport;

    return service;
    
    function generateReport (monthly_reporting_table_data, monthly_reporting_table_data_total_attendance, monthly_reporting_table_legend_data, center_activity, daily_reporting_table_data, callback) { 
        $http.post("/report", {
            monthly_table: monthly_reporting_table_data, 
            monthly_table_total: monthly_reporting_table_data_total_attendance,
            monthly_legend: monthly_reporting_table_legend_data,
            center_activity: center_activity,
            daily_reporting_table_data: daily_reporting_table_data
        })
        .then(
            function(result){            
                callback(result.data) },
            function(){ callback(false) }
        );
    }
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
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_center/centerattendanceinterval/',
            {
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
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_center/centeractivity/',
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
    
    function getAllResidents(project_prefix, page_size, callback){
        //console.log("HAHAS")
        $http.defaults.headers.common.Authorization = localStorage.currentUserToken
        $http.get(digitalOceanAPI.url + '/api/v1/manifest_user/participant/',{
            params: {
                project_prefix: project_prefix
            }
        })
        .then(
            function(result){ callback(result.data) },
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
        $http.get(digitalOceanAPI.url,
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
